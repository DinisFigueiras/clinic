import { FieldError } from "react-hook-form";

type InputFieldProps = {
    label: string;
    type?: string;
    register: any;
    inputName: string;
    defaultValue?: string;
    error?: FieldError;
    valueAsNumber?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    readonly?: boolean;
}


const InputField = (
    {
    label,
    type = "text",
    register,
    inputName,
    defaultValue,
    error,
    inputProps,
    valueAsNumber,
    readonly
    }: InputFieldProps
) => {
    return(
        <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">{label}</label>
            <input
                type={type}
                {...register(inputName, { valueAsNumber })}
                className={
                    `ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full
                    ${readonly ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}`
                }
                {...inputProps}
                defaultValue={defaultValue}
                readOnly={readonly}
            />
            {error?.message && <p className="text-xs text-red-400">{error.message.toString()}</p>}
        </div>
    )
}
export default InputField