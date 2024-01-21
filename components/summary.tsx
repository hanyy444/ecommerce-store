"use client";

import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import Button from "./ui/button";
import Currency from "./ui/currency";
import useCart from "@/hooks/use-cart";

const Summary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const onCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          productIds: items.map((item) => item.id),
        }
      );

      window.location = response.data.url;
    } catch (error) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // Now you can access properties specific to AxiosError
        console.error("Error during checkout:", axiosError);

        // Handle the error, for example, show a user-friendly message
        toast.error(
          "An error occurred during checkout. Please try again later."
        );
      } else {
        // Handle other types of errors if needed
        console.error(
          "Non-Axios error during checkout:",
          error
        );

        // Handle the error, for example, show a user-friendly message
        toast.error(
          "An error occurred during checkout. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">
        Order Summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-800 pt-4">
          <div className="text-base font-medium text-gray-900">
            Order total
          </div>
          <Currency value={totalPrice.toString()} />
        </div>
      </div>
      <Button
        disabled={!items.length || isLoading}
        onClick={onCheckout}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
