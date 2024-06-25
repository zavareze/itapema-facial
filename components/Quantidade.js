export default function Quantidade({quantidade, setQuantidade}) {
    return (
        <>
            <div className="rounded-full border bg-slate-100 dark:bg-slate-600 w-8 px-2 text-center cursor-pointer"
            onClick={() => setQuantidade(quantidade-1 < 0 ? 0 : quantidade-1)}
            >-</div>
            <div className="border mx-2 px-2 w-16 text-center">{quantidade || 0}</div>
            <div className="rounded-full border bg-slate-100 dark:bg-slate-600 w-8 px-2 text-center cursor-pointer"
            onClick={() => setQuantidade(quantidade+1)}>+</div>
        </>
    );
}