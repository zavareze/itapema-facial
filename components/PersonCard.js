export default function PersonCard(person, mostraModal, handleUploadFile) {
    return (
        <li
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
                {person.facial == '1' ? (<div className="text-center text-green-500 font-bold">Reconhecimento Facial Validado!</div>) : ''}
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
        </li>)
}