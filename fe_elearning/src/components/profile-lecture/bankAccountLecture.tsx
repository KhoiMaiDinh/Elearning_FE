'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import InputRegisterLecture from '../inputComponent/inputRegisterLecture';
import { Button } from '../ui/button';
import AlertSuccess from '../alert/AlertSuccess';
import AlertError from '../alert/AlertError';
import AnimateWrapper from '../animations/animateWrapper';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/constants/store';
import { setBankAccount } from '@/constants/bankAccount';
import {
  APIInitPaymentAccount,
  APIGetAllPaymentBank,
  APIGetPaymentAccount,
  APIUpdatePaymentAccount,
} from '@/utils/payment';
import { BankAccount } from '@/types/bankAccount';
import ComboboxRegister from '../selectComponent/comboboxSelect';
// Schema validation
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Tên tài khoản không được để trống')
    .min(3, 'Tên tài khoản phải có ít nhất 3 ký tự'),
  bank_code: yup.string().required('Tên ngân hàng không được để trống'),
  bank_account_number: yup
    .string()
    .required('Số tài khoản không được để trống')
    .matches(/^\d{10,15}$/, 'Số tài khoản phải có từ 10 đến 15 chữ số'),
});

const BankAccountLecture = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  // const bankAccount = useSelector((state: RootState) => state.bankAccount.bankAccountInfo);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, _setLoading] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [allPaymentBank, setAllPaymentBank] = useState<any[]>([]);
  const [hasBankAccount, setHasBankAccount] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = useForm<BankAccount>({
    resolver: yupResolver(schema) as unknown as Resolver<BankAccount>,
    defaultValues: {
      name: '',
      bank_code: '',
      bank_account_number: '',
    },
  });

  const bankAccountInfo = useSelector((state: RootState) => state.bankAccount.bankAccountInfo);

  useEffect(() => {
    if (bankAccountInfo.name) {
      setValue('name', bankAccountInfo.name);
      setValue('bank_code', bankAccountInfo.bank_code);
      setValue('bank_account_number', bankAccountInfo.bank_account_number);
    } else {
      setValue('name', '');
      setValue('bank_code', '');
      setValue('bank_account_number', '');
    }
  }, [bankAccountInfo, setValue, isEdit]);

  useEffect(() => {
    if (hasBankAccount) {
      if (isEdit) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(false);
    }
  }, [hasBankAccount, isEdit]);

  const handleGetAllPaymentBank = async () => {
    const response = await APIGetAllPaymentBank();
    if (response?.status === 200) {
      const data = response.data.map((item: any) => ({
        id: item.bank_code,
        value: item.bank_name,
        image: item.logo_link,
      }));
      setAllPaymentBank(data);
    }
  };

  const handleGetPaymentAccount = async () => {
    const response = await APIGetPaymentAccount(userInfo.id);
    if (response?.status === 200) {
      dispatch(setBankAccount(response.data));
      setHasBankAccount(true);
    }
    if (response?.status === 404) {
      setHasBankAccount(false);
    }
  };

  useEffect(() => {
    handleGetAllPaymentBank();
    handleGetPaymentAccount();
  }, []);

  const handleInitPaymentAccount = async (data: BankAccount) => {
    try {
      const response = await APIInitPaymentAccount(data);
      if (response?.status === 201) {
        dispatch(setBankAccount(response.data));
        setAlertDescription('Thêm tài khoản thành công');
        setHasBankAccount(true);
        setShowAlertSuccess(true);
        setIsEdit(false);

        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setAlertDescription(error instanceof Error ? error.message : 'Thêm tài khoản thất bại');
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  const handleUpdatePaymentAccount = async (data: BankAccount) => {
    try {
      const response = await APIUpdatePaymentAccount(userInfo.id, data);
      if (response?.status === 200) {
        dispatch(setBankAccount(response.data));
        setAlertDescription('Cập nhật tài khoản thành công');
        setIsEdit(false);
        setShowAlertSuccess(true);
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setAlertDescription(error instanceof Error ? error.message : 'Cập nhật tài khoản thất bại');
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    }
  };

  const onSubmit = async (data: BankAccount) => {
    if (!userInfo?.id) {
      setAlertDescription('Không tìm thấy thông tin người dùng');
      setShowAlertError(true);
      return;
    }

    if (hasBankAccount) {
      if (isEdit) {
        handleUpdatePaymentAccount(data);
      }
    } else {
      handleInitPaymentAccount(data);
    }
  };

  return (
    <div className="bg-white dark:bg-black/10 w-full p-4 rounded-b-sm">
      <AnimateWrapper delay={0.2} direction="up" amount={0.1}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-black50 shadow-md rounded-lg p-4 border space-y-4"
        >
          <p className="text-[16px] font-sans font-medium text-black dark:text-AntiFlashWhite">
            Thông tin tài khoản
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Tên tài khoản"
                  error={errors.name?.message}
                  disabled={disabled}
                />
              )}
            />

            <Controller
              name="bank_code"
              control={control}
              render={({ field }) => (
                <ComboboxRegister
                  data={allPaymentBank}
                  {...field}
                  label="Tên ngân hàng"
                  error={errors.bank_code?.message}
                  disabled={disabled}
                  placeholder="Chọn ngân hàng"
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Controller
              name="bank_account_number"
              control={control}
              render={({ field }) => (
                <InputRegisterLecture
                  {...field}
                  labelText="Số tài khoản"
                  error={errors.bank_account_number?.message}
                  disabled={disabled}
                />
              )}
            />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            {hasBankAccount ? (
              isEdit && (
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue text-white"
                >
                  {loading ? 'Đang gửi...' : 'Lưu'}
                </Button>
              )
            ) : (
              <Button
                type="submit" // ✅ sửa từ type="button" thành "submit"
                disabled={loading}
                className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 text-white"
              >
                {loading ? 'Đang gửi...' : 'Thêm tài khoản'}
              </Button>
            )}
          </div>
        </form>

        {hasBankAccount && !isEdit && (
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              onClick={() => setIsEdit(true)}
              className="bg-custom-gradient-button-violet dark:bg-custom-gradient-button-blue hover:brightness-125 text-white"
            >
              Chỉnh sửa
            </Button>
          </div>
        )}
      </AnimateWrapper>

      {showAlertSuccess && <AlertSuccess description={alertDescription} />}
      {showAlertError && <AlertError description={alertDescription} />}
    </div>
  );
};

export default BankAccountLecture;
