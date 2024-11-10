<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <button class="navbar-toggler mb-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <div class="dropdown">
              <button class="bg-white custom" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                  </svg>
                  <span>카테고리</span>
                </div>
              </button>
              <!--드롭 다운 카테고리 입력-->
              <ul class="dropdown-menu">
                <li><button class="dropdown-item" type="button">category1</button></li>
                <li><button class="dropdown-item" type="button">category2</button></li>
                <li><button class="dropdown-item" type="button">category3</button></li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#" style="padding-left: 19.2px; padding-right: 19.2px;">홈</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#" style="padding-left: 19.2px; padding-right: 19.2px;">인기</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" aria-disabled="true" style="padding-left: 19.2px; padding-right: 19.2px;">신규</a>
          </li>
        </ul>
        <form class="d-flex w-50 custom-form-width" role="search">
          <div class="input-group">
            <input class="form-control border-end-0" type="search" placeholder="Search" aria-label="Search">
            <button class="btn border-start-0" type="submit" style="border-color: #dee2e6; background-color: white;">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
export default {

}
</script>


<style scoped>
/* dropdown border 제거*/
.custom{
  outline: none;
  border: none; /* 필요하다면 border도 제거 */
}
.dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0;
}
.nav-item {
  display: flex;
  align-items: center;
}
.form-control:focus {
  outline: none;
  box-shadow: none;
  border-color: #dee2e6;
}
@media (max-width: 991px) {
  .custom-form-width {
    width: 100% !important;
  }
}
</style>