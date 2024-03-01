"use client"
import { useState } from 'react'
import { Image } from 'next/image'
import { redirect } from 'next/navigation'
import { Switch } from '@headlessui/react'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
async function getLogin(matricula, cpf) {
  const body = new URLSearchParams();
  body.append('matricula', matricula);
  body.append('cpf', cpf);
  const res = await fetch(`https://facial.parquedasaguas.com.br/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body,
  });
  const json = await res.json();
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', json['token']);
  }
  return json['titulo'];
}
export default function Login() {
  const [agreed, setAgreed] = useState(false)
  const [matricula, setMatricula] = useState('');
  const [cpf, setCPF] = useState('');
  
  const login = () => {
    if (agreed) {
      const titulo = getLogin(matricula, cpf);
      if (titulo)
        redirect('/cadastro');
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
        <Image src="https://compre.parquedasaguas.com.br/img/cpa.png" className="w-24 mx-auto" alt="Parque das Águas" />
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Reconhecimento Facial Sócios</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Efetue o cadastramento e atualização de dados de reconhecimento facial para sócios e dependentes.
        </p>
      </div>
      <form action={login} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="matricula" className="block text-sm font-semibold leading-6 text-gray-900">
              Matrícula
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="matricula"
                id="matricula"
                onChange={evt => setMatricula(evt.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-semibold leading-6 text-gray-900">
              CPF
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="cpf"
                id="cpf"
                onChange={evt => setCPF(evt.target.value)}
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
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Entrar
          </button>
          <div className='pt-8'>
            <small>Dúvidas Revolution Serviços <a href="//wa.me/5551999926208">(51) 99992-6208</a></small>
          </div>
        </div>
      </form>
    </div>
  )
}
