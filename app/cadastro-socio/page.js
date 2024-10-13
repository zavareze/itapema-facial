"use client";
import EnviarFotoSocio from "@/components/EnviarFotoSocio";
import Loading from "@/components/Loading";
import LoadingFacial from "@/components/LoadingFacial";
import ModalCadastroSocio from "@/components/ModalCadastroSocio";
import Link from "next/link";
import { useEffect, useState } from "react";
const parseJWT = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export default function Cadastro() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [token, setToken] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [person, setPerson] = useState({});
  const setResult = (result) => {
    localStorage.setItem('token', result['token']);
    localStorage.setItem('titulo', JSON.stringify(result['titulo']));
    console.log(result, result['token']);
    setToken(result['token']);
    setTitulos(result['titulos']);
  }
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setTitulos(JSON.parse(localStorage.getItem("titulo")));
  }, [token]);
  const mostraModal = (person) => {
    setPerson(person);
    setShowModal(true);
  };

  const salvar = () => {
    // cadastro(updated, token, onCadastroSuccess);
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-slate-200 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-center py-2">Reconhecimento Facial</h1>
        <div className="pb-4 mx-4 dark:text-slate-300">
          <p className="text-sm">
            Você deve finalizar o cadastro e fazer o reconhecimento 
            facial de todas que estão na cor rosa para que as 
            mesmas possam acessar o clube.
          </p>
          <p className="text-sm">
            Vale lembrar que as mesmas devem também estar em
            dia com as taxas para poder acessar o clube.</p>
            <p className="text-sm font-bold">Clique na pessoa para atualizar os dados da mesma. Após isso você poderá enviar uma nova Foto.</p>
        </div>
        <Link href="/taxas" className={`mb-2 block mx-auto rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm 
        font-semibold text-white shadow-sm hover:bg-indigo-500 
          focus-visible:outline focus-visible:outline-2 
          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 `}>
            Pagamento de taxas clique aqui
        </Link>
        <h1 className="text-lg font-bold text-center">Relação de Pessoas no Título</h1>
        <ul
          role="list"
          className="divide-y sm:grid sm:grid-cols-3 sm:gap-4 cursor-pointer px-2 pb-2"
        >
          {titulos?.map((person) => (
            <li
              key={person.matricula}
              className={
                "flex justify-between flex-wrap gap-x-6 mx-2 py-2 mb-2 rounded shadow " +
                (person.facial == "1" ? "bg-white dark:bg-slate-700" : "bg-red-100 dark:bg-rose-950")
              }
            >
              <div className="flex min-w-0 gap-x-4 px-2"
              onClick={() => {
                mostraModal(person);
              }}>
                <div className="w-24 flex-none">
                  <img
                    className="w-40 h-32 rounded-lg"
                    src={person.foto}
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                    {person.nome}
                  </p>
                  {person.cpf == '' ? (<div className="text-red-700 bg-yellow-300 rounded p-2 text-center">CLIQUE AQUI PARA ATUALIZAR OS DADOS CADASTRAIS</div>) : ''}
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-slate-300">
                    {person.cpf}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-slate-300">
                    {person.celular}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-slate-300">
                    {person.email}
                  </p>
                </div>
              </div>
              <div className="px-1 text-xs">
                <div className="grid grid-cols-2">
                  <div className="text-left">Carteira: <b className={person.carteira_vencida != '0' ? 'text-red-500' : 'text-green-500'}>{person.vencimento_carteira ? person.vencimento_carteira : 'Vencida'}</b></div>
                  <div className="text-right">Taxa Sanitária: <b className={person.taxa_sanitaria_vencida != '0' ? 'text-red-500' : 'text-green-500'}>{person.vencimento_taxa_sanitaria ? person.vencimento_taxa_sanitaria : 'Vencida'}</b></div>
                </div>
                { person.facial == '1' ? (<div className="text-center text-green-500 font-bold">Reconhecimento Facial Validado!</div>) : '' }
                <div className="grid grid-cols-2 gap-x-4">
                {person.cpf != '' ? <EnviarFotoSocio matricula={person.matricula} setLoading={setLoading} setResult={setResult} /> : (<div className="text-center font-bold text-red-500 col-span-2">Após salvar todos os dados você poderá enviar a Foto para efetuar o reconhecimento facial</div>)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showModal ? <ModalCadastroSocio person={person} setResult={(result) => setResult(result)} setLoading={(show) => setLoadingFetch(show)} setShowModal={(show) => setShowModal(show)} /> : null}
      {loading ? <LoadingFacial /> : null}
      {loadingFetch ? <Loading /> : null}
    </>
  )
}
