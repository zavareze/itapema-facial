import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModalCartao({total, pedido, show, setCarregando, setShowModal}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [registro, setRegistro] = useState({
        cardNumber: '',
        cardName: '',
        cardMonth:'',
        cardYear: '',
        cardCvv: '',
        cardInstallments: 1
    });
    const [updated, setUpdated] = useState({
    });
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setUpdated({ ...updated, [name]: value });
    };
    const pagar = async () => {
      try {
          setCarregando(true);
          const r = await fetch(`https://facial.parquedasaguas.com.br/rede`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                pedido,
                cardHolderName: updated.cardName,
                cardNumber: updated.cardNumber,
                securityCode: updated.cardCvv,
                expirationYear: updated.cardYear,
                expirationMonth: updated.cardMonth,
                amount: total,
                installments: updated.cardInstallments,
                screenWidth: screen.availWidth,
                screenHeight: screen.availHeight,
              }),
          });
          const result = await r.json();
          setCarregando(false);
          if (result.success) {
            router.push(result.url);
          }
      } catch (error) {
        setCarregando(false);
      }
    }
return show ?? (
<div>
  <div
    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none"
    // onClick={() => setShowModal(false)}
  >
    <div className="relative w-auto my-6 mx-auto max-w-3xl z-20">
      {/*content*/}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-800 outline-none focus:outline-none">
        {/*header*/}
        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 className="text-3xl font-semibold">
            Pagamento via Cartão de Crédito
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
          { !loading ? (<div className="grid grid-cols-3 gap-x-4 gap-y-6">
            <div className="col-span-3">
                <label htmlFor="cardNumber" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    Número do Cartão
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="cardNumber"
                    id="cardNumber"
                    defaultValue={registro.cardNumber}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="col-span-3">
                <label htmlFor="cardName" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    Nome Titular
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="cardName"
                    id="cardName"
                    defaultValue={registro.cardName}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="cardMonth" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    Mês
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="cardMonth"
                    id="cardMonth"
                    defaultValue={registro.cardMonth}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="cardYear" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    Ano
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="cardYear"
                    id="cardYear"
                    defaultValue={registro.cardYear}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="cardCvv" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    CVV
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="cardCvv"
                    id="cardCvv"
                    defaultValue={registro.cardCvv}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="col-span-3">
                <label htmlFor="cardInstallments" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    Parcelas
                </label>
                <div className="mt-2">
                    <select
                    name="cardInstallments"
                    id="cardInstallments"
                    defaultValue={registro.cardInstallments}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                        <option value="1">1x sem juros de R$ {total?.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</option>
                        <option value="2">2x sem juros de R$ {((total/2).toFixed(2)*1)?.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</option>
                        <option value="3">3x sem juros de R$ {((total/3).toFixed(2)*1)?.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</option>
                        <option value="4">4x sem juros de R$ {((total/4).toFixed(2)*1)?.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</option>
                        <option value="5">5x sem juros de R$ {((total/5).toFixed(2)*1)?.toLocaleString('pt-BR', { minimumFractionDigits: 2})}</option>
                    </select>
                </div>
            </div>
                <div className="text-sm col-span-3">
                    Dúvidas, envie um whatsapp para o suporte (51) 99992-6208
                </div>
          </div>) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="text-3xl font-bold text-center">
                Aguarde Processamento dos dados pela operadora, após alguns momentos você será 
                redirecionado para ambiente seguro do banco para efetuar a autenticação
              </div>
            </div>
          )}
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
          <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => pagar()}
            >
                Pagar
            </button>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-10 bg-black" onClick={() => setShowModal(false)}></div>
  </div>
</div>);
}