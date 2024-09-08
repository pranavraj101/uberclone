import { Text, View } from "react-native";
import CustomButton from "./CustomButton";
import ConfirmRide from "@/app/(root)/confirm-ride";

const Payment = () =>{
  const openPaymentSheet = async () => {};
  return(
    <>
      <CustomButton
        title = "Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  )
}

export default Payment;