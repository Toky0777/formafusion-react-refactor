const Learner = () => (
    <div class="w-full min-h-screen mt-2 p-4 bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
        <div class="flex flex-col w-full h-full px-4">
            <div class="w-full h-full mx-auto">
                <section id="content" class="p-2 mt-2">
                    <div class="flex items-center justify-between w-full mb-3">
                        <section id="filterSection" class="">
                            <div class="flex flex-col text-2xl">
                                <h1 class="text-slate-700">
                                    <span class=" font-semibold"> vous avez <span class="text-[#A462A4]  font-semibold "> 8 </span>
                                        formateurs</span>
                                </h1>
                            </div>
                        </section>
                    </div>
                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 animate-slide-up">
                        <div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]">
                            <div class="flex flex-col justify-first w-full h-full gap-2"><div class="flex gap-2 flex-wrap p-2">
                                <div class="col-span-2 flex justify-start"><div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                    <img alt="Andrianjafisoa Mialy Vololona Eva" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/672c52eeb1eec.webp" />
                                </div>
                                </div>
                                <div class="col-span-4 flex flex-col gap-2 ">
                                    <p class=" font-semibold text-slate-500">Andrianjafisoa</p>
                                    <p class=" text-slate-500">Mialy Vololona Eva</p>
                                </div>
                            </div>
                                <div class="w-full bg-slate-50 h-1/3 rounded-xl">
                                    <div class="flex flex-col h-full gap-2 p-2">
                                        <div class="w-full"><div class="grid grid-cols-5">
                                            <div class="grid justify-start col-span-2 grid-cols-subgrid">
                                                <div class="flex flex-col">
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div class="flex flex-col w-full gap-1">
                                            <div class="inline-flex items-center gap-1"><div class="w-[18px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                                <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></div><p class="text-gray-500">eva@numerika.center</p></div>
                                            <div class="inline-flex items-center gap-1">
                                                <div class="w-[18px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                                </div><p class="text-gray-500">(+261) 32 03 231 40</p></div></div></div></div><div class="flex items-center justify-end border-t-[1px] gap-3 p-3"><button title="Voir le CV">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button><button title="Modifier">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg></button><button title="Supprimer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600"><path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                                    </button></div></div></div><div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]"><div class="flex flex-col justify-first w-full h-full gap-2"><div class="flex gap-2 flex-wrap p-2"><div class="col-span-2 flex justify-start">
                                        <div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                            <img alt="El Fayad Said Oumari" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/66c606b059d6e.webp" /></div>
                                    </div><div class="col-span-4 flex flex-col gap-2 "><p class=" font-semibold text-slate-500">El Fayad</p><p class=" text-slate-500">Said Oumari</p></div></div><div class="w-full bg-slate-50 h-1/3 rounded-xl"><div class="flex flex-col h-full gap-2 p-2">
                                        <div class="w-full"><div class="grid grid-cols-5"><div class="grid justify-start col-span-2 grid-cols-subgrid"><div class="flex flex-col">
                                        </div></div>
                                        </div>
                                        </div>
                                        <div class="flex flex-col w-full gap-1"><div class="inline-flex items-center gap-1">
                                            <div class="w-[18px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                                <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></div><p class="text-gray-500">excel@numerika.center</p></div><div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 
        0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                                </div><p class="text-gray-500">(+261) 32 03 213 63</p></div></div></div></div>
                                        <div class="flex items-center justify-end border-t-[1px] gap-3 p-3"><button title="Voir le CV"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                                            <button title="Modifier"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg></button><button title="Supprimer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600"><path d="M3 6h18"></path>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button></div>
                                    </div></div><div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]">
                            <div class="flex flex-col justify-first w-full h-full gap-2"><div class="flex gap-2 flex-wrap p-2"><div class="col-span-2 flex justify-start"><div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img alt="RAKOTOMANDIMBY JEAN FREDY Soasombola Tsilavina" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/1740403237.png" />
                            </div>
                            </div><div class="col-span-4 flex flex-col gap-2 "><p class=" font-semibold text-slate-500">RAKOTOMANDIMBY JEAN FREDY</p>
                                    <p class=" text-slate-500">Soasombola Tsilavina</p></div></div><div class="w-full bg-slate-50 h-1/3 rounded-xl"><div class="flex flex-col h-full gap-2 p-2">
                                        <div class="w-full"><div class="grid grid-cols-5"><div class="grid justify-start col-span-2 grid-cols-subgrid"><div class="flex flex-col"></div></div></div></div>
                                        <div class="flex flex-col w-full gap-1"><div class="inline-flex items-center gap-1">
                                            <div class="w-[18px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                                <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                            </div><p class="text-gray-500">tsilavina@numerika.center</p></div>
                                            <div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1
    .72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg></div><p class="text-gray-500"></p></div></div></div></div><div class="flex items-center justify-end border-t-[1px] gap-3 p-3">
                                    <button title="Voir le CV"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                                    <button title="Modifier"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                    </svg></button><button title="Supprimer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600">
                                            <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button></div></div></div>
                        <div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]"><div class="flex flex-col justify-first w-full h-full gap-2"><div class="flex gap-2 flex-wrap p-2"><div class="col-span-2 flex justify-start">
                            <div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img alt="RAMAROKOTO ANDRIANIRINTSOA Tsiory Dera" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/6756e88a9b88f.webp" /></div>
                        </div><div class="col-span-4 flex flex-col gap-2 ">
                                <p class=" font-semibold text-slate-500">RAMAROKOTO ANDRIANIRINTSOA</p><p class=" text-slate-500">Tsiory Dera</p></div></div><div class="w-full bg-slate-50 h-1/3 rounded-xl">
                                <div class="flex flex-col h-full gap-2 p-2"><div class="w-full"><div class="grid grid-cols-5"><div class="grid justify-start col-span-2 grid-cols-subgrid"><div class="flex flex-col"></div></div></div></div>
                                    <div class="flex flex-col w-full gap-1"><div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></div><p class="text-gray-500">tsiory@numerika.center</p></div><div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 
    12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><p class="text-gray-500">(+261) 34 70 266 61</p></div></div></div></div>
                            <div class="flex items-center justify-end border-t-[1px] gap-3 p-3"><button title="Voir le CV">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                    <circle cx="12" cy="12" r="3"></circle></svg></button><button title="Modifier">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg></button>
                                <button title="Supprimer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600">
                                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button></div></div></div>
                        <div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]"><div class="flex flex-col justify-first w-full h-full gap-2"><div class="flex gap-2 flex-wrap p-2"><div class="col-span-2 flex justify-start">
                            <div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img alt="RAMIANDRISOANIANINA Daniel Eddy" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/67b583cc6e13a.webp" /></div>
                        </div><div class="col-span-4 flex flex-col gap-2 "><p class=" font-semibold text-slate-500">RAMIANDRISOANIANINA</p><p class=" text-slate-500">Daniel Eddy</p></div></div><div class="w-full bg-slate-50 h-1/3 rounded-xl">
                                <div class="flex flex-col h-full gap-2 p-2"><div class="w-full"><div class="grid grid-cols-5"><div class="grid justify-start col-span-2 grid-cols-subgrid"><div class="flex flex-col"></div></div></div></div>
                                    <div class="flex flex-col w-full gap-1"><div class="inline-flex items-center gap-1">
                                        <div class="w-[18px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></div><p class="text-gray-500">eddy@numerika.center</p></div><div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 
            2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><p class="text-gray-500">0320323160</p>
                                        </div></div></div></div><div class="flex items-center justify-end border-t-[1px] gap-3 p-3">
                                <button title="Voir le CV"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                                <button title="Modifier"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg></button><button title="Supprimer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600">
                                        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button></div></div>
                        </div><div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]"><div class="flex flex-col justify-first w-full h-full gap-2"><div class="flex gap-2 flex-wrap p-2"><div class="col-span-2 flex justify-start">
                            <div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img alt="Raveloson Levy" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/6686b29f6595b.webp" /></div></div>
                            <div class="col-span-4 flex flex-col gap-2 "><p class=" font-semibold text-slate-500">Raveloson</p><p class=" text-slate-500">Levy</p></div></div><div class="w-full bg-slate-50 h-1/3 rounded-xl">
                                <div class="flex flex-col h-full gap-2 p-2"><div class="w-full"><div class="grid grid-cols-5"><div class="grid justify-start col-span-2 grid-cols-subgrid"><div class="flex flex-col"></div></div></div></div>
                                    <div class="flex flex-col w-full gap-1"><div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></div><p class="text-gray-500">contact@forma-fusion.com</p>
                                    </div><div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 
            2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    </div><p class="text-gray-500">(+261) 32 03 231 62</p></div></div></div></div>
                            <div class="flex items-center justify-end border-t-[1px] gap-3 p-3">
                                <button title="Voir le CV"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                                <button title="Modifier"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg></button><button title="Supprimer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600"><path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button></div></div></div>
                        <div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]"><div class="flex flex-col justify-first w-full h-full gap-2"><div class="flex gap-2 flex-wrap p-2"><div class="col-span-2 flex justify-start">
                            <div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <img alt="Tovoniaina Tsinjonjanahary Ernest" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/1737356626.png" /></div>
                        </div><div class="col-span-4 flex flex-col gap-2 "><p class=" font-semibold text-slate-500">Tovoniaina</p><p class=" text-slate-500">Tsinjonjanahary Ernest</p></div></div><div class="w-full bg-slate-50 h-1/3 rounded-xl">
                                <div class="flex flex-col h-full gap-2 p-2"><div class="w-full"><div class="grid grid-cols-5"><div class="grid justify-start col-span-2 grid-cols-subgrid"><div class="flex flex-col"></div></div></div></div><div class="flex flex-col w-full gap-1">
                                    <div class="inline-flex items-center gap-1"><div class="w-[18px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></div><p class="text-gray-500">tsinjo@numerika.center</p></div><div class="inline-flex items-center gap-1">
                                        <div class="w-[18px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1
                                     2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><p class="text-gray-500">(+261) 32 03 231 69</p></div>
                                </div></div></div><div class="flex items-center justify-end border-t-[1px] gap-3 p-3"><button title="Voir le CV">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button><button title="Modifier">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg></button><button title="Supprimer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600">
                                        <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>
                                    </svg></button></div></div></div><div class="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]">
                            <div class="flex flex-col justify-first w-full h-full gap-2">
                                <div class="flex gap-2 flex-wrap p-2"><div class="col-span-2 flex justify-start">
                                    <div class="w-20 h-20 border-purple-600 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                        <img alt="TSIZY4 fhhhgfh" class="object-cover w-full h-full rounded-full border-purple-600" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/68400471d5014.webp" />
                                    </div></div><div class="col-span-4 flex flex-col gap-2 "><p class=" font-semibold text-slate-500">TSIZY4</p><p class=" text-slate-500">fhhhgfh</p></div></div>
                                <div class="w-full bg-slate-50 h-1/3 rounded-xl"><div class="flex flex-col h-full gap-2 p-2"><div class="w-full"><div class="grid grid-cols-5"><div class="grid justify-start col-span-2 grid-cols-subgrid">
                                    <div class="flex flex-col"></div></div></div></div><div class="flex flex-col w-full gap-1"><div class="inline-flex items-center gap-1">
                                        <div class="w-[18px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail text-purple-600">
                                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                            </svg>
                                        </div>
                                        <p class="text-gray-500">shekmashek@yahoo.fr</p>
                                    </div><div class="inline-flex items-center gap-1">
                                            <div class="w-[18px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-purple-600">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                                                    </path></svg></div><p class="text-gray-500"></p></div></div></div></div><div class="flex items-center justify-end border-t-[1px] gap-3 p-3"><button title="Voir le CV">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye h-4 w-4 text-green-600">
                                                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg></button><button title="Modifier">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 text-yellow-600">
                                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg></button><button title="Supprimer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-4 w-4 text-red-600"><path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17">

                                            </line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
);

export default Learner;

