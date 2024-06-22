"use client";
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
  const [token, setToken] = useState([]);
  const [titulos, setTitulos] = useState([]);
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
    setRegistro(person);
    setUpdated(person);
    setShowModal(true);
  };

  const salvar = () => {
    // cadastro(updated, token, onCadastroSuccess);
    setShowModal(false);
  };
  const DoneIcon = () => (<svg className="w-4 h-4 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>);
  const LoadingIcon = () => (<svg aria-hidden="true" className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>)
  
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center py-2">Reconhecimento Facial</h1>
        <div className="pb-4 px-2">
          <p className="text-sm">
            Você deve finalizar o cadastro e fazer o reconhecimento 
            facial de todas que estão na cor rosa para que as 
            mesmas possam acessar o clube.
          </p>
          <p className="text-sm">
            Vale lembrar que as mesmas devem também estar em
            dia com as taxas para poder acessar o clube</p>
        </div>
        <button type="submit" className={`mb-2 block w-full rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 `}>Pagamento de taxas clique aqui</button>
        <h1 className="text-lg font-bold text-center">Relação de Pessoas no Título</h1>
        <ul
          role="list"
          className="divide-y sm:grid sm:grid-cols-3 sm:gap-4 cursor-pointer px-2 pb-2"
        >
          {titulos?.map((person) => (
            <li
              key={person.matricula}
              className={
                "flex justify-between flex-wrap gap-x-6 py-2 mb-2 rounded shadow " +
                (person.facial == "1" ? "bg-white" : "bg-red-200")
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
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {person.nome}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {person.cpf}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {person.celular}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {person.email}
                  </p>
                </div>
              </div>
              <div className="px-2 text-sm">
                <div>
                  Carteira: <b className="text-red-500">99/99/9999</b>
                  - Taxa Sanitária: <b className="text-red-500">99/99/9999</b></div>
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
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {registro.nome}
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
        </>
      ) : null}
      {loading ? (
        <div className="bg-white w-full px-12 h-full py-28 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 fixed">
          <h2 className="mb-8 text-lg font-semibold text-gray-900 dark:text-white">Aguarde que estamos efetuando o Reconhecimento facial:</h2>
          <div className="mb-8">Este procedimento pode levar em torno de 15 segundos, por favor aguarde</div>
          <ul className="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400">
              <li className="flex items-center">
                  <DoneIcon />
                  Enviando foto para servidor
              </li>
              <li className="flex items-center">
                  <DoneIcon />
                  Processando imagem
              </li>
              <li className="flex items-center">
                  <div role="status">
                      <LoadingIcon />
                      <span className="sr-only">Loading...</span>
                  </div>
                  Fazendo Reconhecimento
              </li>
              <li className="flex items-center">
                  <div role="status">
                      <LoadingIcon />
                      <span className="sr-only">Loading...</span>
                  </div>
                  Comparando Rostos
              </li>
              <li className="flex items-center">
                  <div role="status">
                      <LoadingIcon />
                      <span className="sr-only">Loading...</span>
                  </div>
                  Associando Face
              </li>
          </ul>
        </div>
      ) : null}
    </>
  )
}
