import Mainpage from "../../components/common/MainComponent.vue";
import CategoryView from "../../components/common/CategoryView.vue";
import SearchView from "../../components/common/SearchView.vue";

export default [
  {
    path: "/",
    name: "mainpage",
    component: Mainpage,
  },
  {
    path: "/category/:type/:id",
    name: "Category",
    component: CategoryView,
    props: true,
  },
  {
    path: "/search",
    name: "SearchResult",
    component: SearchView,
  },
];
