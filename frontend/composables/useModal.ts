// composables/useModal.ts - Управление модальными окнами

import type { ModalOptions, ModalState } from "~/types/modal";

export function useModal() {
  const modals = ref<Record<string, ModalState>>({});

  const openModal = (
    id: string,
    component?: Component | any,
    props?: Record<string, any>,
    options?: ModalOptions
  ) => {
    modals.value[id] = {
      isOpen: true,
      component,
      props: props || {},
      persistent: options?.persistent || false,
      backdrop: options?.backdrop,
      keyboard: options?.keyboard,
      size: options?.size,
      position: options?.position,
      zIndex: options?.zIndex,
    };
  };

  const closeModal = (id: string) => {
    const modal = modals.value[id];
    if (modal) {
      modal.isOpen = false;

      // Удаляем модальное окно из состояния через небольшую задержку
      // чтобы анимация закрытия успела проиграть
      setTimeout(() => {
        delete modals.value[id];
      }, 300);
    }
  };

  const isModalOpen = (id: string): boolean => {
    return modals.value[id]?.isOpen || false;
  };

  const getModalProps = (id: string): Record<string, any> => {
    return modals.value[id]?.props || {};
  };

  const getModalComponent = (id: string): Component | any => {
    return modals.value[id]?.component;
  };

  const getModalState = (id: string): ModalState | undefined => {
    return modals.value[id];
  };

  const closeAllModals = () => {
    // Простой и типобезопасный подход
    for (const id in modals.value) {
      const modal = modals.value[id];
      if (modal && !modal.persistent) {
        closeModal(id);
      }
    }
  };

  const closeNonPersistentModals = () => {
    // Используем for...in для итерации по ключам
    for (const id in modals.value) {
      const modal = modals.value[id];
      if (modal?.isOpen && !modal.persistent) {
        closeModal(id);
      }
    }
  };

  // Получение последнего открытого модального окна
  const getLastOpenModal = (): { id: string; modal: ModalState } | null => {
    let lastOpenModal: { id: string; modal: ModalState } | null = null;

    for (const id in modals.value) {
      const modal = modals.value[id];
      if (modal?.isOpen) {
        lastOpenModal = { id, modal };
      }
    }

    return lastOpenModal;
  };

  // Получение всех открытых модальных окон
  const getOpenModals = (): Array<{ id: string; modal: ModalState }> => {
    const openModals: Array<{ id: string; modal: ModalState }> = [];

    for (const id in modals.value) {
      const modal = modals.value[id];
      if (modal?.isOpen) {
        openModals.push({ id, modal });
      }
    }

    return openModals;
  };

  // Обработка ESC для закрытия модалок
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      const openModals = getOpenModals().filter(
        ({ modal }) => !modal.persistent
      );

      if (openModals.length > 0) {
        const lastModal = openModals[openModals.length - 1];
        closeModal(lastModal.id);
      }
    }
  };

  // Обработка клика вне модального окна
  const handleBackdropClick = (modalId: string) => {
    const modal = modals.value[modalId];
    if (modal && !modal.persistent) {
      closeModal(modalId);
    }
  };

  // Хук для автоматического закрытия при смене маршрута
  const closeOnRouteChange = (modalId: string) => {
    const router = useRouter();

    const unwatch = watch(
      () => router.currentRoute.value.path,
      () => {
        closeModal(modalId);
        unwatch(); // Удаляем watcher после закрытия
      }
    );

    return unwatch;
  };

  // Проверка наличия открытых модальных окон
  const hasOpenModals = computed(() => {
    for (const id in modals.value) {
      const modal = modals.value[id];
      if (modal?.isOpen) {
        return true;
      }
    }
    return false;
  });

  // Получение количества открытых модальных окон
  const openModalsCount = computed(() => {
    let count = 0;
    for (const id in modals.value) {
      const modal = modals.value[id];
      if (modal?.isOpen) {
        count++;
      }
    }
    return count;
  });

  // Получение списка открытых модальных окон для компонента
  const openModalsList = computed(() => {
    return getOpenModals();
  });

  // Получение модальных окон по типу
  const getModalsByType = (persistent: boolean) => {
    const result: Array<{ id: string; modal: ModalState }> = [];

    for (const id in modals.value) {
      const modal = modals.value[id];
      if (modal && modal.persistent === persistent) {
        result.push({ id, modal });
      }
    }

    return result;
  };

  // Управление блокировкой скролла body
  const toggleBodyScroll = (lock: boolean) => {
    if (import.meta.client) {
      document.body.style.overflow = lock ? "hidden" : "";
    }
  };

  // Отслеживание изменений в модальных окнах для управления скроллом
  watch(
    hasOpenModals,
    (hasOpen: any) => {
      toggleBodyScroll(hasOpen);
    },
    { immediate: true }
  );

  // События жизненного цикла
  if (import.meta.client) {
    onMounted(() => {
      document.addEventListener("keydown", handleKeydown);
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", handleKeydown);
      // Восстанавливаем скролл при размонтировании
      toggleBodyScroll(false);
    });
  }

  return {
    modals: readonly(modals),
    openModal,
    closeModal,
    isModalOpen,
    getModalProps,
    getModalComponent,
    getModalState,
    closeAllModals,
    closeNonPersistentModals,
    getLastOpenModal,
    getOpenModals,
    getModalsByType,
    handleBackdropClick,
    closeOnRouteChange,
    hasOpenModals,
    openModalsCount,
    openModalsList,
  };
}
