"use client";
import { SortBy, Spinner, Menus, ConfirmDelete, Modal, ConfirmConsumption, ConfirmReplinch } from "@/components/ui";
import { formatCurrency } from "@/utils/helpers";
import { HiEye, HiMinus, HiPencil, HiPlus, HiTrash } from "react-icons/hi2";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";
import { useGetStorageItemsCategories, useAddStorageActivity, useDeleteStorageItem } from "@/hooks/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProfile } from "@/hooks/authentication";
import { CreateStorageItemForm } from ".";
import { Tr,Td,ImageComponent,TdImage } from "@/components/ui/MoeTable";
type StorageMoeRowProps = {
  StorageItems: any;
};

export default function StorageMoeRow({StorageItems}: StorageMoeRowProps) {
  const { permissions, owner } = useGetProfile();
    const {addActivity,isAdding,Tpromise : TpromiseAdd}=useAddStorageActivity();
    const {deleteItem,isDeleting,Tpromise : TpromiseDelete}=useDeleteStorageItem();
    const {StorageItemsCategories,error,isLoading}=useGetStorageItemsCategories();
      const router = useRouter();
  // console.log(StorageItems, StorageItemsCategories, isLoading);
  //    // if (!StorageItems?.data.storage && !isLoading) return <Empty>No data to show at the moment</Empty>;
  const Language = useSettingsStore(state => state.Language);
  const menuId = `storage-menu-${StorageItems.id}`;
  return (
    <>
      <Tr key={StorageItems.id}>
        <Td>{StorageItems.id}</Td>
        <TdImage>
          <ImageComponent src={StorageItems.img}  alt={StorageItems.name}/>
        </TdImage>
        <Td>{StorageItems.name}</Td>
        <Td>{StorageItems.quantity}</Td>
        <Td>{formatCurrency(StorageItems.cost)}</Td>
        <Td>
          {
            StorageItemsCategories?.data.storage.find(
              (categoryD: any) => categoryD.id == 1
            ).name
          }
        </Td>
        <Td>{StorageItems.location}</Td>
        <Td>
          <Menus>
            <Modal>
              <Menus.Menu>
                <Menus.Toggle id={menuId} />
                <Menus.List id={menuId}>
                  <Menus.Button
                    icon={<HiEye />}
                    onClick={() =>
                      router.push(`/reports?itemId=${StorageItems.id}`)
                    }
                  >
                    {Language === "en" ? "Details" : "تفاصيل"}
                  </Menus.Button>
                  {(permissions?.StorageEdit || owner) && (
                    <>
                      <Modal.Open opens="edit">
                        <Menus.Button icon={<HiPencil />}>
                          {Language === "en" ? "Edit" : "تعديل"}
                        </Menus.Button>
                      </Modal.Open>
                      <Modal.Open opens="replinch">
                        <Menus.Button icon={<HiPlus />}>
                          {Language === "en" ? "Replenish" : "تعبئة"}
                        </Menus.Button>
                      </Modal.Open>
                      <Modal.Open opens="Consumption">
                        <Menus.Button icon={<HiMinus />}>
                          {Language === "en" ? "Consumption" : "استهلاك"}
                        </Menus.Button>
                      </Modal.Open>
                    </>
                  )}
                  {(permissions?.StorageDelete || owner) && (
                    <Modal.Open opens="delete">
                      <Menus.Button icon={<HiTrash />}>
                        {Language === "en" ? "Delete" : "حذف"}
                      </Menus.Button>
                    </Modal.Open>
                  )}
                </Menus.List>

                 <Modal.Window name="edit">
                    <CreateStorageItemForm ItemToEdit={{...StorageItems}}/>
                </Modal.Window>

                <Modal.Window name="replinch">
                    <ConfirmReplinch
                        resourceName={StorageItems.name}
                        disabled={false}
                        onConfirm={(e) => { addActivity({ id: StorageItems.id, newItemData: e, isReplinching: true })}}
                        isLoading={isAdding}
                        promise={TpromiseAdd}
                        />
                </Modal.Window>
                <Modal.Window name="Consumption">
                    <ConfirmConsumption
                        resourceName={StorageItems.name}
                        resourceQty={StorageItems.quantity}
                        disabled={false}
                        onConfirm={(e) => { addActivity({ id: StorageItems.id, newItemData: e, isReplinching: false }) }}
                        isLoading={isAdding}
                        promise={TpromiseAdd}
                        />
                </Modal.Window>
                {/* <Modal.Window name="delete">
                    <ConfirmDelete
                        resourceName={StorageItems.name}
                        disabled={false}
                        onConfirm={() => {deleteItem({storage_item_id,img})}}
                    />
                </Modal.Window> */}
              </Menus.Menu>
            </Modal>
          </Menus>
        </Td>
      </Tr>
    </>
  );
}
