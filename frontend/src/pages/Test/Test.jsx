import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../api/config";

export function Test() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const testCall = async () => {
      const token = localStorage.getItem("jwtToken");

      const resp = await axios(`${SERVER_URL}/order-history/get`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
      });
      setData(resp.data);
      console.log(resp.data);
    };
    testCall();
  }, []);

  return (
    <>
      {data?.map((v) => {
        console.log(v);
      })}
    </>
  );
}
