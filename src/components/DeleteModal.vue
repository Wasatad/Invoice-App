<template>
  <div class="modal-wrap">
    <div class="modal-card">
      <h2>Confirm Deletion</h2>

      <div class="description">
        Are you sure you want to delete invoice #XM9141? This action cannot be
        undone.
      </div>
      <div class="buttons">
        <button @click="deleteItem">Cancel</button>
        <button @click="cancelDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.modal-wrap {
  z-index: 1000;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

  .modal-card {
    background-color: $spaceCadetDark;
    margin: calc(40vh) auto;
    max-width: 480px;
    padding: 46px;
    border-radius: 12px;
    color: #fff;

    h2 {
      font-weight: 700;
      font-size: 30px;
      margin-bottom: 16px;
    }

    .description {
      font-weight: 400;
      font-size: 15px;
      line-height: 22px;
      color: $lavenderWeb;
      margin-bottom: 16px;
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      button {
        cursor: pointer;
        padding: 17px 24px;
        border-radius: 24px;
        font-weight: 700;
        font-size: 15px;
        color: $lavenderWeb;
        transition: 0.3s ease;
        &:nth-child(1) {
          background-color: $spaceCadetLight;
          &:hover {
            background-color: $richBlack;
          }
        }
        &:nth-child(2) {
          background-color: $redSalsa;
          &:hover {
            background-color: $lightCoral;
          }
        }
      }
    }
  }
}
</style>
