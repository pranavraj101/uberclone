import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { OAuth } from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignUp } from '@clerk/clerk-expo'
import { fetchAPI } from "@/lib/fetch";
import { neon } from '@neondatabase/serverless';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [verification, setVerification] = useState({
    state:"defualt",
    error:"",
    code:""
  })

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerification({
        ...verification,
        state:"pending"
      })
    } catch (err: any) {
      // console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })
      console.log("Completed sign up", completeSignUp);

      if (completeSignUp.status === 'complete') {
        //TODO: create a new user in DataBase
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });


        // const sql = neon("postgresql://uber_owner:h3CgXnfkzvG8@ep-shrill-wave-a11nleh9.ap-southeast-1.aws.neon.tech/uber?sslmode=require");
        // console.log("LOG 1", sql);
        // const response = await sql`
        //   INSERT INTO users (
        //     name, 
        //     email, 
        //     clerk_id
        //   ) 
        //   VALUES (
        //     ${form.name}, 
        //     ${form.email},
        //     ${completeSignUp.createdUserId}
        // );`;
        // console.log("Responsse",response);
        
        await setActive({ session: completeSignUp.createdSessionId })
        setVerification({...verification, state:"success"})
      } else {
        console.error("Error 2",JSON.stringify(completeSignUp, null, 2))
        setVerification({
          ...verification,
          error:"Verification Failed",
          state: "failed"
        })
      }
    } catch (err: any) {
      console.error("Error 1",JSON.stringify(err, null, 2))
      setVerification({
        ...verification,
        error:err.errors[0].longMessage,
        state: "failed"
      })
    }
  }


  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]"/>
          <Text className="text-2xl text-black font-JakartaSemiBold relative bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        {verification.state === "success" && (
            <View className="flex-1 justify-center items-center mt-10">
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] w-4/5">
                <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"/>
                <Text className="text-3xl font-JakartaBold text-center">
                  Verified
                </Text>
                <Text className="text-base text-gray-400 font-Jakarta text-center">
                  You have successfully Verified your account.
                </Text>
                <CustomButton title="Browse Home" onPress={()=>router.replace("/(root)/(tabs)/home")} className="mt-5"/>
              </View>
            </View>
          )}


          {verification.state === "pending" && (
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px] w-4/5 mt-10">
              <Text className="text-3xl font-JakartaBold mb*2">
                Verification
              </Text>
              <Text className="mb-5 font-Jakarta">
                We have sent a verification code to {form.email}.
              </Text>
              <InputField
                label="Code"
                icon={icons.lock}
                placeholder="12345"
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code)=>setVerification({...verification, code})}
              />

              {verification.error &&(
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}
              <CustomButton title="Verify Email" onPress={onPressVerify} className="mt-5 bg-success-500"/>
            </View>
          )}
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter Your Name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({
              ...form,
              name:value
            })}
          />

          <InputField
            label="Email"
            placeholder="Enter Your Email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({
              ...form,
              email:value
            })}
          />

          <InputField
            label="Password"
            placeholder="Enter Your password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({
              ...form,
              password:value
            })}
          />

          <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6"/>

          {/* OAuth */}
          <OAuth/>

          <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
            <Text>Already have and Account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        
        
      </View>
    </ScrollView>
  )
}

export default SignUp;