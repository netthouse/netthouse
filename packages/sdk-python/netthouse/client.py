"""Netthouse x402 client - pay for HTTP resources with USDC."""

from __future__ import annotations

import base64
import json
import secrets
import time
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import requests
from eth_account import Account

# Supported networks: chainId + USDC contract + EIP-712 domain name.
NETWORKS: Dict[str, Dict[str, Any]] = {
    "base": {
        "chain_id": 8453,
        "usdc": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "domain_name": "USD Coin",
    },
    "base-sepolia": {
        "chain_id": 84532,
        "usdc": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        "domain_name": "USDC",
    },
}


@dataclass
class PaymentResult:
    """Result of a fetch: the HTTP response plus payment info."""

    response: requests.Response
    paid: bool
    payment_header: Optional[str] = None


class X402Client:
    """Minimal x402 client: discover paid resources and pay with USDC."""

    def __init__(self, private_key: str, timeout: int = 60):
        if not private_key.startswith("0x"):
            private_key = "0x" + private_key
        if len(private_key) != 66:  # 0x + 64 hex = 66
            raise ValueError(
                f"Private key must be 64 hex chars after 0x, got {len(private_key)-2}"
            )
        self._key = private_key
        self._account = Account.from_key(private_key)
        self._timeout = timeout
        self._session = requests.Session()

    @property
    def address(self) -> str:
        """Payer wallet address."""
        return self._account.address

    def discover(self, base_url: str) -> List[Dict[str, Any]]:
        """Fetch the x402 catalog of paid resources from a server."""
        resp = self._session.get(
            base_url.rstrip("/") + "/discover", timeout=self._timeout
        )
        resp.raise_for_status()
        return resp.json().get("items", [])

    def fetch(self, url: str, **kwargs: Any) -> PaymentResult:
        """GET a URL; on HTTP 402 sign an EIP-3009 authorization and retry."""
        resp = self._session.get(url, timeout=self._timeout, **kwargs)
        if resp.status_code != 402:
            return PaymentResult(response=resp, paid=False)

        try:
            body = resp.json()
        except Exception:
            body = resp.text

        requirements = self._select_requirements(body)
        header = self._sign_payment(requirements)
        paid_resp = self._session.get(
            url,
            headers={"X-PAYMENT": header},
            timeout=self._timeout,
            **kwargs,
        )
        return PaymentResult(response=paid_resp, paid=True, payment_header=header)

    @staticmethod
    def _select_requirements(body: Any) -> Dict[str, Any]:
        # Supported 402 body formats:
        #   {"accepts": [...]}          - x402 spec
        #   {"requirements": {...}}     - Netthouse middleware
        #   {"requirements": [...]}     - list variant
        #   [...] or {...scheme...}     - raw requirement(s)
        accepts: list = []
        if isinstance(body, list):
            accepts = body
        elif isinstance(body, dict):
            if isinstance(body.get("accepts"), list):
                accepts = body["accepts"]
            elif "requirements" in body:
                req = body["requirements"]
                accepts = req if isinstance(req, list) else [req]
            elif "scheme" in body:
                accepts = [body]

        for req in accepts:
            if not isinstance(req, dict):
                continue
            if req.get("scheme") != "exact":
                continue
            if req.get("network") in NETWORKS:
                return req

        print(f"[sdk-debug] 402 body (first 500 chars): {str(body)[:500]}")
        raise ValueError(
            f"No supported x402 payment requirements (got {type(body).__name__})"
        )

    def _sign_payment(self, req: Dict[str, Any]) -> str:
        net = NETWORKS[req["network"]]
        now = int(time.time())
        valid_after = now - 60
        valid_before = now + int(req.get("maxTimeoutSeconds", 60))
        nonce = "0x" + secrets.token_hex(32)
        value = int(req["maxAmountRequired"])

        domain = {
            "name": net["domain_name"],
            "version": "2",
            "chainId": net["chain_id"],
            "verifyingContract": net["usdc"],
        }
        types = {
            "TransferWithAuthorization": [
                {"name": "from", "type": "address"},
                {"name": "to", "type": "address"},
                {"name": "value", "type": "uint256"},
                {"name": "validAfter", "type": "uint256"},
                {"name": "validBefore", "type": "uint256"},
                {"name": "nonce", "type": "bytes32"},
            ]
        }
        message = {
            "from": self.address,
            "to": req["payTo"],
            "value": value,
            "validAfter": valid_after,
            "validBefore": valid_before,
            "nonce": nonce,
        }

        signed = Account.sign_typed_data(
            self._key,
            domain_data=domain,
            message_types=types,
            message_data=message,
        )
        signature = signed.signature.hex()
        if not signature.startswith("0x"):
            signature = "0x" + signature

        payload = {
            "x402Version": 1,
            "scheme": "exact",
            "network": req["network"],
            "payload": {
                "signature": signature,
                "authorization": {
                    "from": self.address,
                    "to": req["payTo"],
                    "value": str(value),
                    "validAfter": str(valid_after),
                    "validBefore": str(valid_before),
                    "nonce": nonce,
                },
            },
        }
        return base64.b64encode(json.dumps(payload).encode()).decode()