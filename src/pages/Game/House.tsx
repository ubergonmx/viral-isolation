import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { ISurvivor } from "./GameInterface";
import { useParams } from "react-router-dom";

function House({ survivor, id, itemCapacity }: { survivor: ISurvivor | undefined; id: number; itemCapacity: number }) {
  const [itemsRemaining, setItemsRemaining] = useState(itemCapacity);
  const [display, setDisplay] = useState("");
  const [entered, setEntered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const { code } = useParams();
  const houseName = "House " + id;

  // useEffect(() => {
  //   function receiveItem(receivedId: number, item: string) {
  //     if (receivedId === id) {
  //       console.log("Received item: " + item);
  //       setItem(true);
  //       setItemsRemaining((prevItemsRemaining) => prevItemsRemaining - 1);
  //     }
  //   }

  //   socket.on("receive-survivor-item", receiveItem);

  //   return () => {
  //     socket.off("receive-survivor-item", receiveItem);
  //   };
  // }, [socket, id]);

  useEffect(() => {
    console.log("survivor: " + survivor?.name);
    setEntered(survivor!.housesEntered.includes(id));

    return () => {
      console.log("unmounting");
    };
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  function getItem() {
    if (!entered) {
      if (itemsRemaining > 0) {
        setDisplay("Draw an item card");
        setItemsRemaining((prevItemsRemaining) => prevItemsRemaining - 1);
        survivor?.housesEntered.push(id); // TODO: double check this
        setEntered(true);
        socket.emit("get-survivor-item", { code: code, survivor: survivor, houseId: id });
      } else {
        // TODO: add socket emit to enter house
        setDisplay("No more items in this house");
        console.log("No more items in this house");
      }
      setIsOpen(true);
    }
  }

  return (
    <>
      <div>
        <button onClick={getItem} disabled={entered} className="disabled:bg-gray-700 disabled:text-gray-50">
          House {id}
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-xl font-medium leading-6 text-white">
                    {houseName}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-lg text-white text-center">{display}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default House;
