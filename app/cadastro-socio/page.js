"use client";
import Loading from "@/components/Loading";
import LoadingFacial from "@/components/LoadingFacial";
import ModalCadastroSocio from "@/components/ModalCadastroSocio";
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
  const onUploadSuccess = (response) => {
    setLoading(false);
    if (response['response'] == 'success') {
      localStorage.setItem('token', response['token']);
      localStorage.setItem('titulo', JSON.stringify(response['titulo']));
      setToken('');
      setShowModal(false)
      alert(response['message']);
    } else {
      let str = response['message'];
      if (response.errors) {
        str += '\n\n';
        for (const [k, v] of Object.entries(response['errors'])) {
          str += v+'\n';
        }
      }
      alert(str);
    }
  };
  const handleUploadFile = (event) => {
    // console.log('loading file', event.target.files[0]);
    const img = document.createElement('img');
    img.onload = () => {
      const scale = 3200 / img.width < 1000 / img.height ? 3200 / img.width : 1000 / img.height;
      const dst = document.createElement("canvas");
      dst.width = img.width * scale;
      dst.height = img.height * scale;
      const ctx = dst.getContext("2d");
      ctx.drawImage(img, 0, 0, dst.width, dst.height);
      const body = { matricula: registro.matricula, image: dst.toDataURL() };
      // console.log('arquivo carregado e redimensionado', JSON.stringify(body));
      upload(body, token, onUploadSuccess);
      setLoading(true);
      setShowModal(false);
    }
    img.src = window.URL.createObjectURL(event.target.files[0]);
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
      <div className="bg-slate-200">
        <h1 className="text-2xl font-bold text-center py-2">Reconhecimento Facial</h1>
        <div className="pb-4 mx-4 dark:text-slate-300">
          <p className="text-sm">
            Você deve finalizar o cadastro e fazer o reconhecimento 
            facial de todas que estão na cor rosa para que as 
            mesmas possam acessar o clube.
          </p>
          <p className="text-sm">
            Vale lembrar que as mesmas devem também estar em
            dia com as taxas para poder acessar o clube</p>
        </div>
        <button type="submit" className={`mb-2 block mx-auto rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm 
        font-semibold text-white shadow-sm hover:bg-indigo-500 
          focus-visible:outline focus-visible:outline-2 
          focus-visible:outline-offset-2 focus-visible:outline-indigo-600 `}>
            Pagamento de taxas clique aqui
        </button>
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
                (person.facial == "1" ? "bg-white dark:bg-slate-700" : "bg-red-200")
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
              <div className="px-2 text-sm">
                <div>
                  Carteira: <b className={person.carteira_vencida != '0' ? 'text-red-500' : 'text-green-500'}>{person.vencimento_carteira ? person.vencimento_carteira : 'Vencida'}</b>
                  - Taxa Sanitária: <b className={person.taxa_sanitaria_vencida != '0' ? 'text-red-500' : 'text-green-500'}>{person.vencimento_taxa_sanitaria ? person.vencimento_taxa_sanitaria : 'Vencida'}</b></div>
                { person.facial == '1' ? (<div className="text-center text-green-500 font-bold">Reconhecimento Facial Validado!</div>) : '' }
                <div className="flex">
                {person.cpf != '' ? (
                  <>
                    <button
                      className="btn-responsive bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      <input type="file" name="image" id="upload" accept="image/*" capture="user" onChange={handleUploadFile}></input>
                      Foto Câmera
                    </button>
                    <button
                      className="btn-responsive bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      <input type="file" name="image2" id="upload2" accept="image/*" onChange={handleUploadFile}></input>
                      Procurar na Galeria
                    </button>
                  </>) : (<div className="mb-4 text-center font-bold text-red-500">Após salvar todos os dados você poderá enviar a Foto para efetuar o reconhecimento facial</div>)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showModal ? <ModalCadastroSocio person={person} setPerson={(person) => setPerson(person)} setShowModal={(show) => setShowModal(show)} /> : null}
      {loading ? <LoadingFacial /> : null}
      {loadingFetch ? <Loading /> : null}
    </>
  )
}
