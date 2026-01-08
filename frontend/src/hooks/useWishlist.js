import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../api/config";

export const useWishlist = (bookId) => {
  const token = localStorage.getItem("jwtToken");
  const [isWish, setIsWish] = useState(false);

  useEffect(() => {
    async function getWish() {
      const resp = await axios.post(
        `${SERVER_URL}/wishlist/exists`,
        { bookId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsWish(resp.data);
    }
    if (token) {
      getWish();
    }
  }, []);

  const toggleWish = async () => {
    const resp = await axios.post(
      `${SERVER_URL}/wishlist/toggle`,
      { bookId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setIsWish((prev) => !prev);
    return resp.data;
  };
  return { isWish, toggleWish };
};
