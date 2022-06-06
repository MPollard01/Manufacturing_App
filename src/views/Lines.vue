<template>
  <div class="wrap">
    <div class="container">
      <div v-if="!machineViewVisible">
      <el-card shadow="hover" :body-style="style">
        <el-button type="primary" icon="el-icon-search" circle></el-button>
        <input
          v-model="search"
          class="search"
          placeholder="Type to search..."
        />
        <el-dropdown>
          <el-button type="primary" icon="el-icon-plus" plain></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="machineDialogVisible = true"
                >Add machine</el-dropdown-item
              >
              <el-dropdown-item @click="productTableVisible = true"
                >Manage products</el-dropdown-item
              >
              <el-dropdown-item @click="packageTableVisible = true"
                >Manage packaging</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-card>

      <el-dialog title="Add machine" v-model="machineDialogVisible" @close="onMachineDialogClose">
        <el-form>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item>
                  <label>Machine name*</label>
                  <input
                    v-model="machineName.value"
                    :ref="machineName.ref"
                    type="text"
                  />
                  <span class="error" v-if="machineName.error">{{
                    machineName.error.message
                  }}</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item>
                  <label for="">Machine number*</label>
                  <input
                    type="number"
                    v-model="machineNumber.value"
                    :ref="machineNumber.ref"
                  />
                  <span class="error" v-if="machineNumber.error">{{
                    machineNumber.error.message
                  }}</span>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item>
                  <label for="">Speed*</label>
                  <input
                    type="number"
                    v-model.number="machineSpeed.value"
                    :ref="machineSpeed.ref"
                  />
                  <span class="error" v-if="machineSpeed.error">{{
                    machineSpeed.error.message
                  }}</span>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item>
                  <el-time-picker
                    v-model="setupTime.value"
                    :ref="setupTime.ref"
                    placeholder="Setup time"
                  >
                  </el-time-picker>
                  <span class="error" v-if="setupTime.error">{{
                    setupTime.error.message
                  }}</span>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-form-item>
            <label for="">Machine description</label>
            <input type="text" v-model="machineDescription" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="machineDialogVisible = false">Close</el-button>
            <el-button type="primary" @click="machineForm"
              >Add Machine</el-button
            >
          </span>
        </template>
      </el-dialog>

      <el-dialog
        title="Manage products"
        v-model="productTableVisible"
        width="95%"
      >
        <template>
          <el-dialog
            title="Create product"
            v-model="productDialogVisible"
            @close="onProductDialogClose"
            append-to-body
          >
            <el-form>
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item>
                      <label>Name*</label>
                      <input
                        type="text"
                        v-model="productName.value"
                        :ref="productName.ref"
                      />
                      <span class="error" v-if="productName.error">{{
                        productName.error.message
                      }}</span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="!updateProduct" :span="12">
                  <div class="grid-content bg-purple-light">
                    <el-form-item>
                      <label for="">Item number*</label>
                      <input type="number" v-model="itemNumber.value" :ref="itemNumber.ref" />
                      <span class="error" v-if="itemNumber.error">{{
                        itemNumber.error.message
                      }}</span>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item>
                      <label for="">Speed*</label>
                      <input
                        type="number"
                        v-model.number="productSpeed.value"
                        :ref="productSpeed.ref"
                      />
                      <span class="error" v-if="productSpeed.error">{{
                        productSpeed.error.message
                      }}</span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <el-form-item>
                      <el-select
                        v-model="productPackaging.value"
                        :ref="productPackaging.ref"
                        placeholder="Select product packaging"
                      >
                        <el-option
                          v-for="item in packageList"
                          :key="item.name"
                          :value="item.name"
                        >
                        </el-option>
                      </el-select>
                      <span class="error" v-if="productPackaging.error">{{
                        productPackaging.error.message
                      }}</span>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-form-item>
                <label for="">Comment</label>
                <input type="text" v-model="productComment" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="productDialogVisible = false"
                  >Close</el-button
                >
                <el-button type="primary" @click="productForm">Create Product</el-button>
              </span>
            </template>
          </el-dialog>
        </template>
        <el-table :data="productList">
          <el-table-column
            property="name"
            label="Name"
            width="150"
          ></el-table-column>
          <el-table-column
            property="itemNumber"
            label="Item number"
            width="200"
          ></el-table-column>
          <el-table-column property="speed" label="Speed"></el-table-column>
          <el-table-column
            property="packaging"
            label="Packaging"
          ></el-table-column>
          <el-table-column property="comment" label="Comment"></el-table-column>
          <el-table-column label="Edit">
            <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editProducts(scope.$index)"
              circle
            ></el-button>
           </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="productTableVisible = false">Close</el-button>
            <el-button type="primary" @click="productDialogVisible = true"
              >Add Product</el-button
            >
          </span>
        </template>
      </el-dialog>

      <el-dialog
        title="Manage packages"
        v-model="packageTableVisible"
        width="60%"
      >
        <template>
          <el-dialog
            title="Create packages"
            v-model="packageDialogVisible"
            @close="onPackageDialogClose"
            append-to-body
          >
            <el-form>
              <el-form-item>
                <label for="">Name*</label>
                <input
                  type="text"
                  v-model="packageName.value"
                  :ref="packageName.ref"
                />
                <span class="error" v-if="packageName.error">{{
                  packageName.error.message
                }}</span>
              </el-form-item>
              <el-form-item>
                <label for="">Package description</label>
                <input type="text" v-model="packageDescription" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="packageDialogVisible = false"
                  >Close</el-button
                >
                <el-button type="primary" @click="packageForm">Create Package</el-button>
              </span>
            </template>
          </el-dialog>
        </template>
        <el-table :data="packageList">
          <el-table-column
            property="name"
            label="Name"
            width="150"
          ></el-table-column>
          <el-table-column
            property="description"
            label="Description"
          ></el-table-column>
        </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="packageTableVisible = false">Close</el-button>
            <el-button type="primary" @click="packageDialogVisible = true"
              >Add Package</el-button
            >
          </span>
        </template>
      </el-dialog>

      <div v-if="machineList && dataLoaded">
        <Machines v-for="m in searchList" :key="m" :machineInfo="m" :batchData="batchData" @click="getMachine(m)"/>
      </div>
      </div>
      <MachineView v-if="machineViewVisible" :machine="currentMachine" :machineList="machineList" :batchData="batchData" @hide="machineViewVisible = false"/>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useForm } from "vue-hooks-form";
import datastoreService from "@/services/DatastoreService";
import { ElMessage } from "element-plus";
import Machines from "@/components/Machines";
import MachineView from "@/components/MachineView"
export default {
  name: "Lines",
  components: {Machines, MachineView},
  setup() {
    const machineViewVisible = ref(false)
    const currentMachine = ref({})
    const search = ref("");
    const style = { padding: "10px" };
    const machineDialogVisible = ref(false);
    const productDialogVisible = ref(false);
    const packageDialogVisible = ref(false);
    const productTableVisible = ref(false);
    const packageTableVisible = ref(false);
    const machineList = ref([])
    const productList = ref([]);
    const packageList = ref([]);
    const updateProduct = ref(false)
    const batchData = ref([])
    const dataLoaded = ref(false)
    let productIndex

    const searchList = computed(() => {
      return machineList.value.filter(item => {
       return item.name.includes(search.value)
      })
    })

    function getMachine(machine) {
      currentMachine.value = machine
      machineViewVisible.value = true
    }

    // form validation
    const { useField, handleSubmit } = useForm({
      defaultValues: {},
      validateMode: 'submit'
    });

    const { useField: useField2, handleSubmit: handleSubmit2 } = useForm({
      defaultValues: {},
      validateMode: 'submit'
    });

    const { useField: useField3, handleSubmit: handleSubmit3 } = useForm({
      defaultValues: {},
      validateMode: 'submit'
    });

    const machineName = useField("machine name", {
      rule: { required: true },
    });
    const machineNumber = useField("machine number", {
      rule: { required: true },
    });
    const machineSpeed = useField("machine speed", {
      rule: { required: true },
    });
    const setupTime = useField("setup time", {
      rule: { required: true },
    });
    const machineDescription = ref("");

    const productName = useField2("product name", {
      rule: { required: true },
    });
    const itemNumber = useField2("item number", {
      rule: { required: true },
    });
    const productSpeed = useField2("speed", {
      rule: { required: true },
    });
    const productPackaging = useField2("packaging", {
      rule: { required: true },
    });
    const productComment = ref("");

    const packageName = useField3("packaging name", {
      rule: { required: true },
    });
    const packageDescription = ref("");

    // form handlers
    const machineForm = () => {
      const data = {
        name: machineName.value,
        number: machineNumber.value,
        speed: machineSpeed.value,
        setupTime: setupTime.value,
        description: machineDescription.value
      }
      datastoreService.addData(data, "machines", machineNumber.value)
      machineList.value.push(data)
      machineDialogVisible.value = false
    };

    const productForm = () => {
      const data = {
        name: productName.value,
        itemNumber: itemNumber.value,
        speed: productSpeed.value,
        packaging: productPackaging.value,
        comment: productComment.value
      }
      if(updateProduct.value) {
        productList.value[productIndex] = data
        datastoreService.updateData("products", itemNumber.value, data)
      }
      else {
        datastoreService.addData(data, "products", itemNumber.value)
        productList.value.push(data)
      }
     
      productDialogVisible.value = false
      ElMessage.success({
        message: "product added to database"
      })
    };

    function editProducts(index) {
      productDialogVisible.value = true
      updateProduct.value = true
      productName.value = productList.value[index].name
      itemNumber.value = productList.value[index].itemNumber
      productSpeed.value = productList.value[index].speed
      productPackaging.value = productList.value[index].packaging
      productComment.value = productList.value[index].comment
    }

    const packageForm = () => {
      const data = {
        name: packageName.value,
        description: packageDescription.value
      }
      datastoreService.addData(data, "packaging", packageName.value)
      packageList.value.push(data)
      packageDialogVisible.value = false
      ElMessage.success({
        message: "packaging added to database"
      })
    };

    function onMachineDialogClose() {
      machineName.value = ''
      machineNumber.value = ''
      machineSpeed.value = ''
      setupTime.value = ''
      machineDescription.value = ''
      if(machineName.error) machineName.error.message = ''
      if(machineNumber.error) machineNumber.error.message = ''
      if(machineSpeed.error) machineSpeed.error.message = ''
      if(setupTime.error) setupTime.error.message = ''
    }

    function onProductDialogClose() {
      productName.value = ''
      itemNumber.value = ''
      productSpeed.value = ''
      productPackaging.value = ''
      productComment.value = ''
      if(productName.error) productName.error.message = ''
      if(itemNumber.error) itemNumber.error.message = ''
      if(productSpeed.error) productSpeed.error.message = ''
      if(productPackaging.error) productPackaging.error.message = ''
      updateProduct.value = false
    }

    function onPackageDialogClose() {
      packageName.value = ''
      packageDescription.value = ''
      if(packageName.error) packageName.error.message = ''
    }

    return {
      search,
      style,
      machineDialogVisible,
      productDialogVisible,
      packageDialogVisible,
      productList,
      productTableVisible,
      packageTableVisible,
      packageList,
      machineList,
      machineName,
      machineNumber,
      machineSpeed,
      setupTime,
      machineDescription,
      productName,
      itemNumber,
      productSpeed,
      productPackaging,
      productComment,
      packageName,
      packageDescription,
      machineForm: handleSubmit(machineForm),
      productForm: handleSubmit2(productForm),
      packageForm: handleSubmit3(packageForm),
      onMachineDialogClose,
      onProductDialogClose,
      onPackageDialogClose,
      searchList,
      editProducts,
      updateProduct,
      getMachine,
      machineViewVisible,
      currentMachine,
      batchData,
      dataLoaded
    };
  },
  async created() {
    this.machineList = await datastoreService.fetchData("machines")
    this.productList = await datastoreService.fetchData("products")
    this.packageList = await datastoreService.fetchData("packaging")
    this.batchData = await datastoreService.fetchAllBatches()
    this.dataLoaded = true
  }
};
</script>

<style scoped>
.search {
  border: none;
  border-bottom: 2px solid #dcdfe6;
  border-radius: 0;
  margin: 0 40px 0 10px;
  width: 80%;
}
.grid-content input {
  width: 90%;
}

input {
  width: 95%;
}

label {
  left: 10px;
}

.error {
  left: 0;
}

.search:focus {
  border-bottom: 2px solid #53a8ff;
}

.el-select {
  width: 90%;
}
</style>
