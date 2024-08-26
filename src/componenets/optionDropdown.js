import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function Options({handleEditClick,handleOpenDeleteModal}) {
    return (
      <Menu as="div" className="relative inline-block   text-left z-10">
        <div >
          <MenuButton className="flex w-8 justify-center">
            <img src="https://cdn-icons-png.flaticon.com/128/7794/7794505.png" alt="" className="bg-white p-1 rounded-full shadow-lg" />
          </MenuButton>
        </div>
  
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            {/* <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
               onClick={handleEditClick}>
                Edit
              </a>
            </MenuItem> */}
            <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"  onClick={handleOpenDeleteModal}
              >
                Delete
              </a>
            </MenuItem>
            
            
          </div>
        </MenuItems>
      </Menu>
    )
  }