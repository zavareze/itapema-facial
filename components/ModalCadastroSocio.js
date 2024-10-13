import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModalCadastroSocio({person, setResult, setLoading, setShowModal}) {
    const [updated, setUpdated] = useState(person);
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const handleOnChange = (event) => {
      const { name, value } = event.target;
      setUpdated({ ...updated, [name]: value });
    };
    const salvar = async () => {
        try {
            let post = Object.assign({}, updated);
            delete post.foto;
            delete post.carteira_vencida;
            delete post.facial;
            delete post.taxa_sanitaria_vencida;
            delete post.updated;
            delete post.vencimento_carteira;
            delete post.vencimento_taxa_sanitaria;
            // console.log(post, localStorage.getItem('token'));
            setLoading(true);
            
            const r = await fetch(`https://facial.parquedasaguas.com.br/cadastro/titulo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),

                },
                body: JSON.stringify(post),
            });
            const result = await r.json();
            
            setLoading(false);
            if (result.status == 'fail') {
                if (result.type == 'data')
                    setErrors(result.errors);
                else
                    alert(result.message);
                if (result.type == 'token')
                    router.push('/login-socio');
                console.log('fail');
            } else {
              console.log('else', result);
                setShowModal(false);
                setResult(result);
            }
        } catch (error) {
            setLoading(false);
            
        }
    }



    return (<>
    <div
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none"
    >
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-slate-900 outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 className="text-3xl font-semibold">
              {person.nome}
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="col-span-2">
                <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                  CPF
                </label>
                <div className="mt-2">
                  <input
                    mask="999.999.999-99"
                    type="text"
                    name="cpf"
                    id="cpf"
                    defaultValue={person.cpf}
                    onChange={handleOnChange}
                    className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`+
                     (errors.cpf ? ' bg-red-200' : '')}
                  />
                </div>
                <div className="text-xs text-red-500">{errors.cpf}</div>
              </div>
              <div>
                <label htmlFor="data_nascimento" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                  Data Nascimento
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="data_nascimento"
                    id="data_nascimento"
                    defaultValue={person.data_nascimento}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:4"
                  />
                <div className="text-xs text-red-500">{errors.date}</div>
                </div>
              </div>
              <div>
                <label htmlFor="celular" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                  Celular
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    name="celular"
                    id="celular"
                    defaultValue={person.celular}
                    autoComplete='billing mobile tel'
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="text-xs text-red-500">{errors.celular}</div>
              </div>
              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                  E-Mail
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={person.email}
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                <div className="text-xs text-red-500">{errors.email}</div>
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="cidade" className="block text-sm font-semibold leading-4 text-gray-900 dark:text-slate-300">
                  Cidade
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="cidade"
                    id="cidade"
                    defaultValue={person.cidade}
                    autoComplete="home city"
                    onChange={handleOnChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="text-xs text-red-500">{errors.cidade}</div>
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
    </div>
    <div className="opacity-25 fixed inset-0 z-30 bg-black"></div>
  </>)
}