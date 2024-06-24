export default function ModalFormaPagamento({total, cpf, show, setShowModal, setFormaPagamento}) {
  const geraPedido = async () => {
    try {
        setCarregando(true);
        const r = await fetch(`https://facial.parquedasaguas.com.br/visitante/consulta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({cpf: updated.cpf}),
        });
        const result = await r.json();
        setCarregando(false);
        if (result.status == 'fail' && !result.valid) {
            setError(result.message);
        } else {
            avancar(result);
        }
    } catch (error) {
      setCarregando(false);
    }
  }
return show ?? (
<div>
  <div
    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none"
  >
    <div className="relative w-auto my-6 mx-auto max-w-3xl z-20">
      {/*content*/}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        {/*header*/}
        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 className="text-3xl font-semibold">
            Forma de Pagamento
          </h3>
          <button
            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={() => setShowModal(false)}
          >
            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
              ×
            </span>
          </button>
        </div>
        {/*body*/}
        <div className="relative p-4 flex-auto">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="font-bold text-2xl text-center mx-4 p-4 border rounded bg-green-100">
                    Total R$ {total?.toLocaleString('pt-BR', { minimumFractionDigits: 2})}
                </div>
                <div className="mx-4">Escolha a forma de pagamento, caso opte por cartão de crédito na próxima tela você poderá parcelar</div>
                <div
                    className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm
                     hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                    onClick={() => {
                        setFormaPagamento(5);
                    }}
                >
                    PIX
                </div>
                <div
                    className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white shadow-sm 
                    hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                    onClick={() => {
                        setFormaPagamento(1);
                    }}
                >
                    Cartão Crédito
                </div>
          </div>
        </div>
        {/*footer*/}
        <div className="flex items-center flex-wrap justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-10 bg-black" onClick={() => setShowModal(false)}></div>
  </div>
</div>);
}