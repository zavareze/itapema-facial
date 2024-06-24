import { useState } from "react";

export default function ModalCPF({cpf, setShowModal, setCarregando, avancar}) {
    const [error, setError] = useState('');
    const [updated, setUpdated] = useState({
    });
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setUpdated({ ...updated, [name]: value });
    };
    const consultaCadastro = async () => {
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
                setShowModal(false);
                avancar(result);
            }
        } catch (error) {
          setCarregando(false);
        }
    }
return (
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
            Informe seu CPF
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
                <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900">
                    CPF
                </label>
                <div className="mt-2">
                    <input
                    type="number"
                    name="cpf"
                    id="cpf"
                    autoFocus={true}
                    defaultValue={cpf}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div className="text-sm text-red-500">{error}</div>
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
          <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => (!updated.cpf || updated.cpf == '') ? setError('Você deve informar o CPF antes de avançar') : consultaCadastro()}
            >
                Avançar
            </button>
        </div>
      </div>
    </div>
  <div className="opacity-25 fixed inset-0 z-10 bg-black" onClick={() => setShowModal(false)}></div>
  </div>
</div>);
}