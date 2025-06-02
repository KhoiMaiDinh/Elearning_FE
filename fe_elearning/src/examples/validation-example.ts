import * as z from 'zod';
import { ZodPasswordField, ZodEmailField, ZodNameField } from '@/utils/validation';

// Ví dụ 1: Password field bắt buộc (mặc định)
const requiredPasswordSchema = z.object({
  password: ZodPasswordField(), // required by default
});

// Ví dụ 2: Password field không bắt buộc
const optionalPasswordSchema = z.object({
  password: ZodPasswordField({ required: false }),
});

// Ví dụ 3: Form đăng ký người dùng
const userRegistrationSchema = z
  .object({
    firstName: ZodNameField(),
    lastName: ZodNameField(),
    email: ZodEmailField(),
    password: ZodPasswordField(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

// Ví dụ 4: Form cập nhật profile (password optional)
const updateProfileSchema = z.object({
  firstName: ZodNameField(),
  lastName: ZodNameField(),
  email: ZodEmailField(),
  newPassword: ZodPasswordField({ required: false }),
});

// Ví dụ 5: So sánh với YupPasswordField (comment)
/*
// YupPasswordField cũ:
export const YupPasswordField = (options: { required?: boolean } = {}) => {
  let schema = yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number');

  if (options.required === false) {
    schema = schema.notRequired();
  } else {
    schema = schema.required('Password is required');
  }

  return schema;
};

// ZodPasswordField tương đương:
export const ZodPasswordField = (options: { required?: boolean } = {}) => {
  const baseSchema = z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái thường')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái hoa')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất một số')
    .regex(/[@$!%*?&]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt');

  if (options.required === false) {
    return baseSchema.optional();
  }

  return baseSchema;
};
*/

// Type definitions cho examples
type RequiredPasswordForm = z.infer<typeof requiredPasswordSchema>;
type OptionalPasswordForm = z.infer<typeof optionalPasswordSchema>;
type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;
type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export {
  requiredPasswordSchema,
  optionalPasswordSchema,
  userRegistrationSchema,
  updateProfileSchema,
  type RequiredPasswordForm,
  type OptionalPasswordForm,
  type UserRegistrationForm,
  type UpdateProfileForm,
};
