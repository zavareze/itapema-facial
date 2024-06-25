import QRCode from "react-qr-code";

export default function ModalPix({total, pix, pedido, show, setShowModal}) {
return show ?? (
<div>
  <div
    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none"
  >
    <div className="relative w-auto my-6 mx-auto max-w-3xl z-20">
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-800 outline-none focus:outline-none">
        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 className="text-3xl font-semibold">
            Pagamento via PIX
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
        <div className="relative p-4 flex-auto">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="mx-4">
                    <div className="w-72 h-72 bg-green-100 dark:bg-white flex items-center mx-auto">
                        <QRCode value={pix} className="mx-auto my-auto" />
                    </div>
                </div>
                <div className="text-sm mx-4">
                    <div>Pedido: #{pedido}</div>
                    <div>Favorecido: Revolution Serviços</div>
                    <div>CNPJ: 05.411.490/0001-32</div>
                    <div className="font-bold text-xl text-center p-2 border rounded bg-green-100 dark:bg-green-900">
                        Total R$ {total?.toLocaleString('pt-BR', { minimumFractionDigits: 2})}
                    </div>
                </div>
                <div
                    className="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-xl font-semibold text-white 
                    dark:bg-slate-600 shadow-sm 
                    hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                    focus-visible:outline-indigo-600"
                    onClick={() => {
                        setFormaPagamento(1);
                    }}
                >
                    PIX Copia e Cola
                </div>
                <div className="text-sm">
                    Clique no botão para copiar o código PIX e logo após vá para seu aplicativo do banco e 
                    selecione a opção Pix Copia e cola e cole o conteudo lá.
                </div>
                <div className="text-sm">
                    Dúvidas, envie um whatsapp para o suporte (51) 99992-6208
                </div>
          </div>
        </div>
        {/*footer*/}
        <div className="flex items-center flex-wrap justify-end p-4 border-t border-solid border-blueGray-200 rounded-b">
          <button
            className="text-red-500 background-transparent font-bold uppercase px-6 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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