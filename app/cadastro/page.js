"use client";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
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
async function cadastro(req, token, onSuccess) {
  const body = JSON.stringify(req);
  const res = await fetch(
    `https://facial.parquedasaguas.com.br/cadastro/titulo`,
    {
      // mode: 'no-cors',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body,
    }
  );
  const json = await res.json();
  onSuccess(json);
  return json;
}
async function upload(req, token, onSuccess) {
  const res = await fetch(`https://facial.parquedasaguas.com.br/cadastro/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify(req),
  });
  const json = await res.json();
  onSuccess(json);
  return json;
}

export default function Cadastro() {
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState([]);
  const [titulos, setTitulos] = useState([]);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const jwt = parseJWT(localStorage.getItem("token"))
    setTitulos(jwt['titulo']);
  }, [token]);
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


  const mostraModal = (person) => {
    setRegistro(person);
    setUpdated(person);
    setShowModal(true);
  };

  const onCadastroSuccess = (response) => {
    if (response['response'] == 'success') {
      localStorage.setItem('token', response['token']);
      setToken('');
      alert(response['message']);
    } else {
      let str = response['message']+'\n\n';
      for (const [k, v] of Object.entries(response['errors'])) {
        str += v+'\n';
      }
      alert(str);
    }
  };

  const salvar = () => {
    cadastro(updated, token, onCadastroSuccess);
    setShowModal(false);
  };
  const onUploadSuccess = (response) => {
    if (response['response'] == 'success') {
      localStorage.setItem('token', response['token']);
      setToken('');
      setShowModal(false)
      alert(response['message']);
    } else {
      let str = response['message']+'\n\n';
      for (const [k, v] of Object.entries(response['errors'])) {
        str += v+'\n';
      }
      alert(str);
    }
  };
  const handleUploadFile = (event) => {
    console.log('loading file', event.target.files[0]);
    const img = document.createElement('img');
    img.onload = () => {
      const scale = 3200 / img.width < 800 / img.height ? 3200 / img.width : 800 / img.height;
      const dst = document.createElement("canvas");
      dst.width = img.width * scale;
      dst.height = img.height * scale;
      const ctx = dst.getContext("2d");
      ctx.drawImage(img, 0, 0, dst.width, dst.height);
      const body = { matricula: registro.matricula, image: dst.toDataURL() };
      console.log('arquivo carregado e redimensionado', JSON.stringify(body));
      upload(body, token, onUploadSuccess);
    }
    img.src = window.URL.createObjectURL(event.target.files[0]);
  }
  return (
    <>
      <div>
        <div className="pb-4">
        <p className="text-sm">
          Você deve finalizar o cadastro e fazer o reconhecimento 
          facial de todas que estão na cor rosa para que as 
          mesmas possam acessar o clube.
        </p>
        <p className="text-sm">
          Vale lembrar que as mesmas devem também estar em
          dia com as taxas para poder acessar o clube</p>
        </div>
        <h1 className="text-lg font-bold">Relação de Pessoas no Título</h1>
        <ul
          role="list"
          className="divide-y sm:grid sm:grid-cols-3 sm:gap-4 cursor-pointer"
        >
          {titulos?.map((person) => (
            <li
              key={person.matricula}
              className={
                "flex justify-between gap-x-6 py-2 " +
                (person.facial == "1" ? "bg-green-200" : "bg-red-200")
              }
              onClick={() => {
                mostraModal(person);
              }}
            >
              <div className="flex min-w-0 gap-x-4 px-2">
                <div className="w-24 flex-none">
                  <img
                    className="w-40 h-32 rounded-lg"
                    src={
                      "https://sistema.parquedasaguas.com.br/fotos.php?matricula=" +
                      person.matricula
                    }
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
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    Atualizado: {person.updated}
                  </p>
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
                        <InputMask
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
                    className="btn-responsive bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    <input type="file" name="image" id="upload" accept="image/*" capture="environment" onChange={handleUploadFile}></input>
                    Foto Câmera
                  </button>
                  <button
                    className="btn-responsive bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    <input type="file" name="image2" id="upload2" accept="image/*" onChange={handleUploadFile}></input>
                    Procurar na Galeria
                  </button>
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
    </>
  )
}
