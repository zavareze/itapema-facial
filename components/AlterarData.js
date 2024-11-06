import { useState } from "react";

export default function AlterarData({id, data, setResult, setShowModal, setLoading}) {
  const [dataAlterada, setData] = useState(data);
  const salvar = async () => {
    setLoading(true);
    const res = await fetch(`https://facial.parquedasaguas.com.br/visitante/alterar-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ id, data: dataAlterada }),
    });
    const result = await res.json();
    setLoading(false);
    if (result.status == 'success') {
      setResult(result);
      setShowModal(false);
    } else {
      alert(result.message);
    }
  }
  return (
    <div>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl z-40">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-800 outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                Alterar Data
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
                <div>
                  <label htmlFor="pedido" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    Pedido
                  </label>
                  <div className="mt-2">
                    <div
                      className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      #{id}
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                    Data Atual
                  </label>
                  <div className="mt-2">
                    <div
                      className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {data?.toString().split('-').reverse().join('/')}
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900  dark:text-slate-300">
                    Nova Data de Visita
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="data"
                      id="data"
                      defaultValue={data}
                      onChange={e => setData(e.target.value)}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center flex-wrap justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => salvar()}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      <div className="opacity-25 fixed inset-0 z-10 bg-black" onClick={() => setShowModal(false)}></div>
      </div>
    </div>);
}