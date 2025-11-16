import type { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputType {
  name: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
  error?: string;
}

export default function Input({
  name,
  type,
  placeholder,
  error,
  register,
  rules,
}: InputType) {
  return (
    <>
      <section className=" mb-3">
        <input
          className="w-100 p-2 rounded-3 focus-ring border-1"
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
          id={name}
        />
        <div className="text-danger ms-1">{error}</div>
      </section>
    </>
  );
}
