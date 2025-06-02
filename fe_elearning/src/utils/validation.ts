import * as z from 'zod';

/**
 * Password validation schema using Zod
 * Requirements:
 * - At least 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 */
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

/**
 * Complete password regex pattern (more comprehensive)
 */
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Simple password field for basic validation
 */
export const ZodSimplePasswordField = (
  options: { required?: boolean; minLength?: number } = {}
) => {
  const minLength = options.minLength || 8;

  const baseSchema = z
    .string()
    .min(minLength, `Mật khẩu phải có ít nhất ${minLength} ký tự`)
    .regex(passwordRegex, {
      message:
        'Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái thường, 1 số và 1 ký tự đặc biệt',
    });

  if (options.required === false) {
    return baseSchema.optional();
  }

  return baseSchema;
};

/**
 * Email validation schema
 */
export const ZodEmailField = (options: { required?: boolean } = {}) => {
  const baseSchema = z.string().email('Email không hợp lệ');

  if (options.required === false) {
    return baseSchema.optional();
  }

  return baseSchema;
};

/**
 * Name validation schema
 */
export const ZodNameField = (options: { required?: boolean; minLength?: number } = {}) => {
  const minLength = options.minLength || 1;

  const baseSchema = z
    .string()
    .min(minLength, `Tên phải có ít nhất ${minLength} ký tự`)
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và khoảng trắng');

  if (options.required === false) {
    return baseSchema.optional();
  }

  return baseSchema;
};

/**
 * Form schema for user registration
 */
export const createRegistrationSchema = () => {
  return z
    .object({
      first_name: ZodNameField(),
      last_name: ZodNameField(),
      email: ZodEmailField(),
      password: ZodPasswordField(),
      confirmPassword: z.string(),
      terms: z.boolean().refine((val) => val === true, {
        message: 'Bạn phải đồng ý với điều khoản dịch vụ',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    });
};

/**
 * Form schema for password reset
 */
export const createResetPasswordSchema = () => {
  return z
    .object({
      password: ZodPasswordField(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    });
};

/**
 * Form schema for login
 */
export const createLoginSchema = () => {
  return z.object({
    email: ZodEmailField(),
    password: ZodPasswordField(),
  });
};

/**
 * Form schema for forgot password
 */
export const createForgotPasswordSchema = () => {
  return z.object({
    email: ZodEmailField(),
  });
};

/**
 * Form schema for change password
 */
export const createChangePasswordSchema = () => {
  return z
    .object({
      current_password: z.string(),
      new_password: ZodPasswordField(),
      confirm_password: z.string(),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirm_password'],
    });
};
