import React, { useEffect, useState } from "react";
import { formatEther, isAddress, parseEther } from "viem";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

const SendToken = () => {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const ethBalance = useBalance({
    address: account.address,
  });
  console.log(ethBalance);

  const [targetAddress, setTargetAddress] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const { data: hash, sendTransaction } = useSendTransaction();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  });

  const targetBalance = useBalance({
    address: isAddress(targetAddress) ? targetAddress : undefined,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAddress(targetAddress)) {
      return;
    }
    sendTransaction({ to: targetAddress, value: parseEther(targetValue) });
  };

  useEffect(() => {
    if (isSuccess) {
      ethBalance.refetch();
      targetBalance.refetch();
    }
  }, [isSuccess]);

  return (
    <div>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
          <br />
          balance:{" "}
          {ethBalance.isFetched
            ? formatEther(ethBalance.data?.value || BigInt(0))
            : "Loading"}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      {status === "success" && (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter the address you want to transfer token to"
            name="address"
            required
            defaultValue={"0x90B54b482bb2fd7707C36c3b68CF9565adB270d3"}
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            style={{
              width: "300px",
            }}
          />
          {targetBalance.isFetched && (
            <>
              <br />
              <div>
                balance: {formatEther(targetBalance.data?.value || BigInt(0))}
              </div>
            </>
          )}
          <br />
          <input
            type="number"
            placeholder="Enter the amount"
            max={formatEther(ethBalance.data?.value || BigInt(0))}
            min={0}
            step={0.01}
            name="value"
            required
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            style={{
              width: "300px",
            }}
          />
          <br />
          <button type="submit">Submit</button>
          {hash && <div>Transaction hash: {hash}</div>}
          {isLoading && <div>Waiting for confirmation...</div>}
          {isSuccess && <div>Transaction confirmed.</div>}
        </form>
      )}
    </div>
  );
};

export default SendToken;
