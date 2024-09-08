'use client';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

const validCPF = (strCPF) => {
    if (!strCPF) return false;
    if (strCPF * 1 == 0) return false;
    let soma = 0
    let resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(strCPF.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
}
export default function AdicionarPessoa() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [id, setId] = useState(searchParams.get('id'));
    const [pedido, setPedido] = useState({});

    const [visitantes, setVisitantes] = useState([]);
    const [visitante, setVisitante] = useState('');
    const [token, setToken] = useState('');
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
    const [updated, setUpdated] = useState({});
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setUpdated({ ...updated, [name]: value });
    };
    const salvar = (adicionar) => {
        if (updated.cpf) {
            if (!validCPF(updated.cpf)) {
                alert('O CPF Informado é inválido');
                return;
            }
            if (!updated.nome) {
                alert('Você deve informar o Nome');
                return;
            }
            if (!updated.data_nascimento) {
                alert('Você deve informar o Data de Nascimento');
                return;
            }
            if (!updated.celular) {
                alert('Você deve informar o Celular');
                return;
            }
            if (!updated.email) {
                alert('Você deve informar o Email');
                return;
            }
            if (!updated.cidade) {
                alert('Você deve informar a Cidade que mora');
                return;
            }
            // console.log(updated, validCPF(updated.cpf))
        } else {
            // console.log(visitante, validCPF(visitante))
        }
    };
    const adicionarPessoa = async (vinculo) => {
        const res = await fetch(`https://facial.parquedasaguas.com.br/visitante/adicionar-pessoa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token'),
            },
            body: JSON.stringify({ id, vinculo }),
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
        // router.push('/cadastro-visitante')
    }
    useEffect(() => {
        let pedidos = JSON.parse(localStorage.getItem("pedidos"));
        setPedido(pedidos.filter(x => x.id === id)[0]);
        let vis = JSON.parse(localStorage.getItem("visitantes")) || [];
        vis.filter(x => !pedidos.filter(x => x.id === id)[0].vinculos.includes(x.cpf));
        setVisitantes(vis);
        setVisitante(vis?.[0]?.cpf);
        setToken(localStorage.getItem("token"));
    }, [token]);
    return (
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
                                Selecionar Pessoa
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
                                    <label htmlFor="pessoa" className="block text-sm font-semibold leading-4 text-gray-900">
                                        Selecionar
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            name="pessoa"
                                            id="pessoa"
                                            onChange={(evt) => setVisitante(evt.target.value)}
                                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            {visitantes?.map(visitante => (
                                                <option value={visitante.cpf} key={visitante.cpf}>{visitante.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => salvar(false)}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="relative p-4 flex-auto text-center">
                            Ou Cadastre uma nova pessoa
                        </div>
                        <div className="relative p-4 flex-auto">
                        <div>
                                <label htmlFor="cpf" className="block text-sm font-semibold leading-4 text-gray-900">
                                    CPF
                                </label>
                                <div className="mt-2">
                                    <input
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
                                <label htmlFor="nome" className="block text-sm font-semibold leading-4 text-gray-900">
                                    Nome Completo
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="nome"
                                        id="nome"
                                        defaultValue={registro.nome}
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
                                    Cidade onde mora
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
                        {/*footer*/}
                        <div className="flex items-center flex-wrap justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={router.back()}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => salvar(true)}
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