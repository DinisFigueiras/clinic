import FormModal2 from "./FormModal2";

export type FormContainerProps = {
        table:
        | "patients"
        | "medication"
        | "bookings";
        type: "create" | "update" | "delete";
        data?:any;
        id?: number;
}

/**
 * Container component that wraps FormModal2 for form operations
 */
const FormContainer = async ({table, type, data, id}:FormContainerProps) => {
    return (
        <div>
            <FormModal2 table={table} type={type} data={data} id={id}/>
        </div>
    )
}

export default FormContainer;