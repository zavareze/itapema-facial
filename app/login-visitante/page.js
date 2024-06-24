"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Switch } from '@headlessui/react'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

async function verifyCPF(cpf) {
  const res = await fetch(`https://facial.parquedasaguas.com.br/visitante/check`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cpf }),
  });
  const json = await res.json();
  if (json['token'])
    localStorage.setItem('token', json['token']);
  if (json['dados'])
    localStorage.setItem('dados', JSON.stringify(json['dados']));
  return json;
}
async function getLogin(celular, cpf) {
  const res = await fetch(`https://facial.parquedasaguas.com.br/visitante`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ celular, cpf }),
  });
  const json = await res.json();

  if (json['token'])
    localStorage.setItem('token', json['token']);
  if (json['visitantes'])
    localStorage.setItem('visitantes', JSON.stringify(json['visitantes']));
  else 
    localStorage.setItem('visitantes', '[]');
  if (json['pedidos'])
    localStorage.setItem('pedidos', JSON.stringify(json['pedidos']));
  else
    localStorage.setItem('pedidos', '[]');
  return json;
}
export default function Login() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false)
  const [celular, setCelular] = useState('');
  const [cpf, setCPF] = useState('');
  const [registro, setRegistro] = useState({
    matricula: "",
    nome: "",
    cpf: "",
    data_nascimento: "",
    celular: "",
    email: "",
    cidade: "",
    facial: "",
    updated: "",
  });
  const { push } = useRouter();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUpdated({ ...updated, [name]: value });
  };
  const login = async () => {
    if (agreed) {
      const result = await getLogin(celular, cpf);
      console.log('login-result', result);
      if (result.status == 'success') {
        router.push('/cadastro-visitante')
      } else
      if (result.status == 'fail') {
        alert(result['message']);
      }
    } else {
      alert("Você deve concordar com a política de privacidade antes de entrar")
    }
  }
  return (
    <div className="isolate bg-white px-6 py-12 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <img src="https://compre.parquedasaguas.com.br/img/cpa.png" className="w-24 mx-auto" />
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Reconhecimento Facial Visitantes</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Efetue o cadastramento de reconhecimento facial para todos visitantes.
        </p>
      </div>
      <form action={login} className="mx-auto mt-8 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-1">
        <div>
            <label htmlFor="cpf" className="block text-sm font-semibold leading-6 text-gray-900">
              Informe seu CPF
            </label>
            <div className="mt-2.5">
              <input
                type="number"
                name="cpf"
                id="cpf"
                onChange={evt => setCPF(evt.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-semibold leading-6 text-gray-900">
              Informe o Celular com DDD
            </label>
            <div className="mt-2.5">
              <input
                type="number"
                name="celular"
                id="celular"
                onChange={evt => setCelular(evt.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className={classNames(
                  agreed ? 'bg-indigo-600' : 'bg-gray-200',
                  'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                )}
              >
                <span className="sr-only">Estou de acordo com a polícica de privacidade</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    agreed ? 'translate-x-3.5' : 'translate-x-0',
                    'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                  )}
                />
              </Switch>
            </div>
            <Switch.Label className="text-sm leading-6 text-gray-600">
              Eu concordo com a {' '}
              <a href="#" className="font-semibold text-indigo-600">
                Politica de Privacidade (LGPD)
              </a>
              .
            </Switch.Label>
          </Switch.Group>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Entrar
          </button>
        </div>
        </form>
        <div className="mt-4">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => push('/')}
          >
            Voltar
          </button>
        </div>
        <div className='pt-8'>
          <small>Dúvidas Revolution Serviços <a href="//wa.me/5551999926208">(51) 99992-6208</a></small>
        </div>
      {showModal ? (
        <div>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">
                  Cadastro Visitante
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
                        mask="999.999.999-99"
                        type="text"
                        name="cpf"
                        id="cpf"
                        defaultValue={registro.cpf}
                        onChange={handleOnChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        readOnly="readonly"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900">
                      Nome
                    </label>
                    <div className="mt-2">
                      <input
                        mask="999.999.999-99"
                        type="text"
                        name="cpf"
                        id="cpf"
                        defaultValue={registro.cpf}
                        onChange={handleOnChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="data_nascimento" className="block text-sm font-semibold leading-4 text-gray-900">
                      Data Nascimento
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="data_nascimento"
                        id="data_nascimento"
                        defaultValue={registro.data_nascimento}
                        onChange={handleOnChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:4"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="celular" className="block text-sm font-semibold leading-4 text-gray-900">
                      Celular
                    </label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        name="celular"
                        id="celular"
                        defaultValue={registro.celular}
                        autoComplete='billing mobile tel'
                        onChange={handleOnChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold leading-4 text-gray-900">
                      E-Mail
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={registro.email}
                        onChange={handleOnChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cidade" className="block text-sm font-semibold leading-4 text-gray-900">
                      Cidade
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="cidade"
                        id="cidade"
                        defaultValue={registro.cidade}
                        autoComplete="home city"
                        onChange={handleOnChange}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center flex-wrap justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                {registro.cpf != '' ? (
                <>
                  <button
                    className="btn-responsive bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    <input type="file" name="image" id="upload" accept="image/*" capture="user" onChange={handleUploadFile}></input>
                    Foto Câmera
                  </button>
                  <button
                    className="btn-responsive bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    <input type="file" name="image2" id="upload2" accept="image/*" onChange={handleUploadFile}></input>
                    Procurar na Galeria
                  </button>
                </>) : (<div className="mb-4">Após salvar todos os dados você poderá enviar a Foto para efetuar o reconhecimento facial</div>)}
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
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </div>
      ) : null}
    </div>
  )
}
