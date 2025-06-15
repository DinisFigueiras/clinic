/**
 * Generic table component with sorting support
 */
const Table = ({
    columns,
    renderRow,
    data,
    sort,
}: {
    columns: { header: string; accessor:string; className?: string }[];
    renderRow: (item: any) => React.ReactNode;
    data: any[];
    sort?: string;
}) => {
    return(
        <table className="w-full mt-4 border-separate border-spacing-0 rounded-lg overflow-hidden">
            <thead>
                <tr className="text-left text-neutral font-bold text-sm bg-peachLight border-peachLight rounded-lg">
                    {columns.map((col) => (
                      <th key={col.accessor} className={`px-4 py-3 first:rounded-tl-lg last:rounded-tr-lg ${col.className}`}>
                        {col.accessor === "info" ? (
                            <>
                            Informação{" "}
                            {sort === "name_asc" && <span>▲</span>}
                            {sort === "name_desc" && <span>▼</span>}
                            </>
                        ) : (
                            col.header
                        )}
                      </th>  
                    ))}
                </tr>
            </thead>
            <tbody>{data.map((item) => renderRow(item))}</tbody>
        </table>
    )
}

export default Table