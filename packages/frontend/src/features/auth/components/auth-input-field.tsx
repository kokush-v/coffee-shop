import { Control, Controller, Path } from "react-hook-form";

import { Input } from "@/src/components/ui/input";

import { AuthRegisterFields } from "@/src/features/auth/types/auth-register-schema";
import { AuthLoginFields } from "@/src/features/auth/types/auth-login-schema";
import { AuthField } from "@/src/features/auth/types/auth-field";

type AuthInputFieldProps<T extends AuthLoginFields | AuthRegisterFields> = {
  data: AuthField;
  control: Control<T>;
};

export const AuthInputField = <T extends AuthLoginFields | AuthRegisterFields>({
  data,
  control,
}: AuthInputFieldProps<T>) => {
  return (
    <Controller
      // @ts-expect-error typescript requires me to do some weird magic
      defaultValue=""
      control={control}
      name={data.path as Path<T>}
      render={({ field, fieldState }) => (
        <section>
          <p className="text-xs font-semibold mb-1 text-zinc-600">{data.label}</p>
          <Input
            autoComplete={data.autoComplete}
            {...field}
            type={data.type}
            placeholder={data.placeholder}
          />
          {fieldState.error && (
            <span className="text-xs text-red-400 font-medium">
              {fieldState.error.message}
            </span>
          )}
        </section>
      )}
    />
  );
};
