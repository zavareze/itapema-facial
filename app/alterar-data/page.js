'use client';
import { useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

export default function ModalCadastro() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [id, setId] = useState(searchParams.get('id'));
    const [data, setData] = useState(searchParams.get('data'));
    const salvar = async () => {
        const res = await fetch(`https://facial.parquedasaguas.com.br/visitante/alterar-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            },
            body: JSON.stringify({ id, data }),
          });
          const json = await res.json();
          if (json['visitantes'])
            localStorage.setItem('visitantes', JSON.stringify(json['visitantes']));
        else 
            localStorage.setItem('visitantes', '[]');
        if (json['pedidos'])
            localStorage.setItem('pedidos', JSON.stringify(json['pedidos']));
        else
            localStorage.setItem('pedidos', '[]');
        router.push('/cadastro-visitante')
    }
    return (
        <div>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Alterar Data
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => router.back()}
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
                                        Pedido
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            #{searchParams.get('id')?.toString().split('-').reverse().join('/')}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900">
                                        Data Atual
                                    </label>
                                    <div className="mt-2">
                                        <div
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            {searchParams.get('data')?.toString().split('-').reverse().join('/')}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900">
                                        Nova Data de Visita
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            name="data"
                                            id="data"
                                            defaultValue={searchParams.get('data')?.toString()}
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
                                onClick={() => router.back()}
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
        </div>);
}