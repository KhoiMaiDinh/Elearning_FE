import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { Info } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import CreateCouponInput from '../input/createCouponInput';
import * as Yup from 'yup';
import CreateCouponCheckbox from '../input/createCouponCheckbox';
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';
import { useEffect, useMemo, useState } from 'react';
import ToastNotify from '@/components/ToastNotify/toastNotify';
import { toast } from 'react-toastify';
import { styleError, styleSuccess } from '@/components/ToastNotify/toastNotifyStyle';
import { APICreateCoupon, APIUpdateCoupon, APIUpdateCouponStatus } from '@/utils/coupon';
import { CouponType } from '@/types/couponType';
import { APIGetMyCourse } from '@/utils/course';
import { isEqual } from 'lodash';
import { AxiosError } from 'axios';
import { useTheme } from 'next-themes';
const today = new Date();
const now = new Date();

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(today.getDate() + 2);

const ConfigValidationSchema = Yup.object({
  code: Yup.string()
    .transform((value) => (value === '' ? undefined : value))
    .min(3, 'Mã coupon tối thiểu 3 ký tự')
    .max(14, 'Mã coupon tối đa 14 ký tự')
    .optional(),
  type: Yup.string(),
  value: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? 1 : value;
    })
    .required('Giá trị ưu đãi là bắt buộc')
    .integer('Giá trị ưu đãi phải là số nguyên')
    .min(1, 'Ưu đãi tối thiểu 1%')
    .max(100, 'Ưu đãi tối đa 100%'),
  starts_at: Yup.date()
    .required('Ngày bắt đầu là bắt buộc')
    .min(now, 'Ngày bắt đầu phải lớn hơn ngày hiện tại'),
  expires_at: Yup.date()
    .required('Ngày kết thúc là bắt buộc')
    .min(Yup.ref('starts_at'), 'Ngày kết thúc phải lớn hơn ngày bắt đầu'),
  usage_limit: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? undefined : value
    )
    .optional(),
  course: Yup.object()
    .shape({
      id: Yup.string().required('Khóa học là bắt buộc'),
    })
    .optional(),
  is_public: Yup.boolean().optional(),
  is_active: Yup.boolean().optional(),
});

const defaultValues = {
  code: '',
  type: '',
  value: 1,
  starts_at: tomorrow,
  expires_at: dayAfterTomorrow,
  usage_limit: undefined,
  course: { id: '' },
  is_public: false,
  is_active: true,
};

type DialogOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  status: 'scheduled' | 'active' | 'expired';
  coupon?: CouponType;
  triggerButton?: React.ReactNode;
  handleSuccess?: () => void;
  handleError?: () => void;
};

const UpsertCouponDialog: React.FC<DialogOptions> = ({
  open,
  onOpenChange,
  mode,
  coupon,
  handleSuccess,
  status,
  handleError,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(ConfigValidationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const startsAt = watch('starts_at');
  const expiresAt = watch('expires_at');

  useEffect(() => {
    if (startsAt) {
      trigger('expires_at');
    }
  }, [startsAt, trigger]);

  useEffect(() => {
    if (expiresAt) {
      trigger('starts_at');
    }
  }, [expiresAt, trigger]);

  const showSuccess = (message: string) => {
    toast.success(<ToastNotify status={1} message={message} />, { style: styleSuccess });
  };

  const showError = (message: string) => {
    toast.error(<ToastNotify status={-1} message={message} />, { style: styleError });
  };

  const handleClearForm = () => {
    reset(defaultValues);
  };

  const [dataCourse, setDataCourse] = useState<{ id: string; title: string }[]>([]);

  const handleGetOwnedCourses = async () => {
    const response = await APIGetMyCourse();
    if (response?.status === 200) {
      console.log('response', response);
      const filteredCourses = response.data.filter((course: any) => course.published_at !== null);
      const dataCourse = [...filteredCourses];
      setDataCourse(dataCourse);
    }
  };

  useEffect(() => {
    handleGetOwnedCourses();
  }, []);

  const initialCouponData = useMemo(() => {
    if (!coupon) return null;
    return {
      code: coupon.code ?? '',
      value: coupon.value ?? 1,
      starts_at: new Date(coupon.starts_at),
      expires_at: new Date(coupon.expires_at),
      usage_limit: coupon.usage_limit ?? undefined,
      course: { id: coupon.course?.id ?? '' },
      is_public: coupon.is_public ?? false,
      is_active: coupon.is_active ?? false,
    };
  }, [coupon]);

  const watchedFormValues = watch();

  const isFormUnchanged = useMemo(() => {
    if (mode !== 'edit' || !initialCouponData) return false;
    const currentValues = {
      ...watchedFormValues,
      course: {
        id: watchedFormValues?.course?.id || '',
      },
    };
    return isEqual(currentValues, initialCouponData);
  }, [watchedFormValues, initialCouponData, mode]);

  useEffect(() => {
    if (mode === 'edit' && initialCouponData) {
      reset(initialCouponData);
    } else if (mode === 'create') {
      reset(defaultValues);
    }
  }, [mode, coupon, reset, initialCouponData]);

  const onSubmit = async (formData: any) => {
    const body = {
      code: formData.code,
      type: 'percentage',
      value: formData.value,
      starts_at: formData.starts_at,
      expires_at: formData.expires_at,
      usage_limit: formData.usage_limit,
      course: {
        id: formData.course?.id,
      },
      is_public: formData.is_public,
    };
    try {
      if (mode === 'create') {
        const res = await APICreateCoupon(body);
        if (res?.status === 201) {
          showSuccess('Thêm ưu đãi thành công!');
          handleSuccess?.();
          handleClearForm();
        } else {
          showError('Thêm ưu đãi thất bại!');
          handleError?.();
        }
      } else if (mode === 'edit' && coupon?.code) {
        if (status === 'scheduled') {
          const res = await APIUpdateCoupon(body, coupon?.code);
          if (res?.status === 200) {
            showSuccess('Cập nhật ưu đãi thành công!');
            handleSuccess?.();
            handleClearForm();
          } else {
            showError('Cập nhật ưu đãi thất bại!');
            handleError?.();
          }
        } else {
          const res = await APIUpdateCouponStatus(coupon.code);
          console.log('res', res);
          if (res?.status === 204) {
            showSuccess('Cập nhật trạng thái của ưu đãi thành công!');
            handleSuccess?.();
            handleClearForm();
          } else {
            console.log('err', res);
            showError('Cập nhật trạng thái của ưu đãi thất bại!');
            handleError?.();
          }
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err?.response?.data?.errorCode === 'E081') {
          showError(
            'Một Coupon Public cho khóa học này đã tồn tại trong khoảng thời gian bạn chọn!'
          );
          handleError?.();
        }
        if (err?.response?.data?.errorCode === 'E082') {
          showError(`Mã Coupon ${formData.code} đã tồn tại!`);
          handleError?.();
        }
      } else {
        showError('Có lỗi xảy ra khi xử lý: ' + err);
        handleError?.();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-majorelleBlue">
            {mode === 'create' ? 'Tạo Coupon Mới' : 'Chỉnh Sửa Coupon'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Tạo mã khuyến mãi mới cho các khóa học của bạn. Điền thông tin chi tiết bên dưới.'
              : 'Chỉnh sửa thông tin mã khuyến mãi. Điền thông tin chi tiết bên dưới.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mode === 'edit' && status !== 'scheduled') {
              const formData = watchedFormValues;
              onSubmit(formData);
            } else {
              handleSubmit(onSubmit)(e);
            }
          }}
          className="grid py-4"
          id="couponForm"
        >
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <CreateCouponInput
                {...field}
                labelText="Coupon Code"
                type="text"
                error={errors.code?.message}
                placeholder="e.g. SUMMER25"
                disabled={mode == 'edit'}
              />
            )}
          />

          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <CreateCouponInput
                {...field}
                labelText="Discount %"
                type="number"
                error={errors.value?.message}
                placeholder="25"
                min={1}
                max={100}
                isRequired={true}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setValue('value', 1);
                  }
                }}
                disabled={mode == 'edit' && status != 'scheduled'}
              />
            )}
          />

          <Controller
            name="starts_at"
            control={control}
            render={({ field }) => (
              <CreateCouponInput
                {...field}
                isRequired={true}
                labelText="Ngày bắt đầu"
                error={errors.starts_at?.message}
                type="date"
                disabled={mode == 'edit' && status != 'scheduled'}
              />
            )}
          />

          <Controller
            name="expires_at"
            control={control}
            render={({ field }) => (
              <CreateCouponInput
                {...field}
                labelText="Ngày kết thúc"
                error={errors.expires_at?.message}
                type="date"
                disabled={mode == 'edit' && status != 'scheduled'}
              />
            )}
          />

          <Controller
            name="course.id"
            control={control}
            render={({ field }) => (
              <CreateCouponInput
                {...field}
                type="select"
                labelText="Áp dụng với"
                error={errors.course?.id?.message}
                data={dataCourse}
                placeholder="Khóa học"
                dataKey="id"
                dataValue="title"
                isRequired={true}
                disabled={mode == 'edit' && status != 'scheduled'}
              />
            )}
          />

          <Controller
            name="usage_limit"
            control={control}
            render={({ field }) => (
              <CreateCouponInput
                {...field}
                labelText="Số lượng"
                error={errors.usage_limit?.message}
                type="number"
                min={0}
                placeholder="Không giới hạn nếu để trống"
                disabled={mode == 'edit' && status != 'scheduled'}
              />
            )}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-sm font-medium">Options</div>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-row gap-2">
                <Controller
                  name="is_public"
                  control={control}
                  render={({ field }) => (
                    <CreateCouponCheckbox {...field} labelText="Hiển thị công khai" />
                  )}
                  disabled={mode == 'edit' && status != 'scheduled'}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={18} color="#fff" fill="#F3C623" />
                    </TooltipTrigger>
                    <TooltipContent className="w-60 bg-majorelleBlue70" side="right">
                      <text className="flex-wrap text-wrap text-left text-white  ">
                        - Nếu bạn chọn hiển thị công khai, ưu đãi sẽ được hiển thị trên trang chủ và
                        có thể được tìm kiếm bởi người dùng.
                        <br />- Nếu bạn chọn không hiển thị công khai, ưu đãi chỉ được sử dụng trong
                        các chiến dịch KOL, hợp tác của bạn. trong các chiến dịch KOL, hợp tác của
                        bạn.
                      </text>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <DialogFooter>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button
                      className={`bg-majorelleBlue text-white transition-opacity ${
                        isFormUnchanged
                          ? 'cursor-not-allowed opacity-50 hover:opacity-50'
                          : 'hover:bg-majorelleBlue70'
                      }`}
                      type="submit"
                      disabled={isFormUnchanged}
                    >
                      {mode === 'create' ? 'Tạo Coupon' : 'Cập nhật'}
                    </Button>
                  </span>
                </TooltipTrigger>
                {isFormUnchanged && (
                  <TooltipContent className="bg-black text-white">
                    Không có thay đổi để cập nhật
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertCouponDialog;
