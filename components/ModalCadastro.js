export default function ModalCadastro() {
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
</div>);
}