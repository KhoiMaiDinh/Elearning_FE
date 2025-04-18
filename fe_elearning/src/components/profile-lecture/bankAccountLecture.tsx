import React, { useState, useEffect } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  Resolver,
  FieldValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import InputRegisterLecture from "../inputComponent/inputRegisterLecture";
import { Button } from "../ui/button";
import AlertSuccess from "../alert/AlertSuccess";
import AlertError from "../alert/AlertError";
import AnimateWrapper from "../animations/animateWrapper";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/constants/store";
import { setBankAccount } from "@/constants/bankAccount";
import { APIInitPaymentAccount } from "@/utils/payment";
import { BankAccount } from "@/types/bankAccount";

// Schema with more validation
const schema = yup.object().shape({
  accounts: yup.array().of(
    yup.object().shape({
      label: yup
        .string()
        .required("Tên tài khoản không được để trống")
        .min(3, "Tên tài khoản phải có ít nhất 3 ký tự"),
      country_code: yup
        .string()
        .required("Mã quốc gia không được để trống")
        .matches(/^[A-Z]{2}$/, "Mã quốc gia phải là 2 chữ cái in hoa (VD: VN)"),
    })
  ),
});

interface FormValues {
  accounts: BankAccount[];
}

const BankAccountLecture = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      accounts: [],
    },
    resolver: yupResolver(schema) as unknown as Resolver<FormValues>,
  });

  useEffect(() => {
    if (userInfo?.instructor_profile?.bankAccount) {
      const existingAccounts = Array.isArray(
        userInfo.instructor_profile.bankAccount
      )
        ? userInfo.instructor_profile.bankAccount
        : [userInfo.instructor_profile.bankAccount];

      reset({ accounts: existingAccounts as BankAccount[] });
      dispatch(setBankAccount(existingAccounts));
    }
  }, [userInfo, reset, dispatch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accounts",
  });

  const handleAddAccount = () => {
    append({ label: "", country_code: "", id: "" });
  };

  const onSubmit = async (index: number, data: FieldValues) => {
    if (!userInfo?.id) {
      setAlertDescription("Không tìm thấy thông tin người dùng");
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [index]: true }));

      // Format data for API
      const accountData = {
        label: data.accounts[index].label.trim(),
        country_code: data.accounts[index].country_code.toUpperCase(),
      };

      const response = await APIInitPaymentAccount(userInfo.id, accountData);

      if (response?.status === 201) {
        // Update only the specific account in Redux store
        const updatedAccounts = [
          ...(Array.isArray(userInfo.instructor_profile?.bankAccount)
            ? userInfo.instructor_profile.bankAccount
            : []),
        ];
        updatedAccounts[index] = response.data;

        dispatch(setBankAccount(updatedAccounts));
        setAlertDescription("Thêm tài khoản thành công");
        setShowAlertSuccess(true);
        setTimeout(() => setShowAlertSuccess(false), 3000);
      } else {
        throw new Error(
          "Thêm thất bại - Không nhận được phản hồi hợp lệ từ máy chủ"
        );
      }
    } catch (error) {
      console.error("Error submitting bank account:", error);
      setAlertDescription(
        error instanceof Error
          ? error.message
          : "Thêm tài khoản thất bại - Vui lòng thử lại sau"
      );
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-black/10 w-full p-4 rounded-b-sm">
      <AnimateWrapper delay={0.2} direction="up" amount={0.1}>
        <div className="flex flex-col gap-4">
          {fields.map((item, index) => (
            <form
              key={item.id}
              onSubmit={handleSubmit((data) => onSubmit(index, data))}
              className="bg-white dark:bg-black50 shadow-md rounded-lg p-4 border space-y-4"
            >
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
                <Controller
                  name={`accounts.${index}.label`}
                  control={control}
                  render={({ field }) => (
                    <InputRegisterLecture
                      {...field}
                      labelText="Tên tài khoản"
                      error={errors.accounts?.[index]?.label?.message || ""}
                      placeholder="Nhập tên tài khoản"
                    />
                  )}
                />
                <Controller
                  name={`accounts.${index}.country_code`}
                  control={control}
                  render={({ field }) => (
                    <InputRegisterLecture
                      {...field}
                      labelText="Mã quốc gia"
                      error={
                        errors.accounts?.[index]?.country_code?.message || ""
                      }
                      placeholder="VD: VN"
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <Button
                  type="submit"
                  disabled={loadingStates[index]}
                  className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue text-white hover:opacity-90 disabled:opacity-50"
                >
                  {loadingStates[index] ? "Đang xử lý..." : "Gửi xét duyệt"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  disabled={loadingStates[index]}
                >
                  Xoá
                </Button>
              </div>
            </form>
          ))}

          <Button
            type="button"
            onClick={handleAddAccount}
            className="bg-Sunglow hover:opacity-90 text-black w-fit px-4"
          >
            + Thêm tài khoản
          </Button>
        </div>
      </AnimateWrapper>

      {showAlertSuccess && <AlertSuccess description={alertDescription} />}
      {showAlertError && <AlertError description={alertDescription} />}
    </div>
  );
};

export default BankAccountLecture;
