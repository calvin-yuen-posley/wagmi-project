import { useState } from "react";
import { formatEther, isAddress } from "viem";
import { useBalance } from "wagmi";

const CheckBalance = () => {
  const [address, setAddress] = useState(
    "0x00000000219ab540356cBB839Cbe05303d7705Fa"
  );
  const validAddress = isAddress(address) ? address : undefined;
  const ethBalance = useBalance({ address: validAddress });
  const usdcBalance = useBalance({
    address: validAddress,
    token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  });
  const usdtBalance = useBalance({
    address: validAddress,
    token: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  });

  return (
    <div>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter public address(0x)"
      />
      {isAddress(address) ? (
        <>
          <p>
            ETH:{" "}
            {ethBalance.isLoading
              ? "Loading"
              : formatEther(ethBalance.data?.value || BigInt(0))}
          </p>
          <p>
            USDC:{" "}
            {usdcBalance.isLoading
              ? "Loading"
              : formatEther(usdcBalance.data?.value || BigInt(0))}
          </p>
          <p>
            USDT:{" "}
            {usdtBalance.isLoading
              ? "Loading"
              : formatEther(usdtBalance.data?.value || BigInt(0))}
          </p>
        </>
      ) : (
        <div>
          <p>Invalid address</p>
        </div>
      )}
    </div>
  );
};

export default CheckBalance;
