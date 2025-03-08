
    <template>
      <a-form
        ref="companyProfileFormRef"
        name="dynamic_form_company_profile"
        autocomplete="off"
        layout="vertical"
        :model="companyProfileDynamicValidateForm"
        :rules="companyProfileRules"
        @validate="handleCompanyProfileValidate"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-space direction="vertical" class="relative-child">
          <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="mainTab" tab="Dados principais">
      <a-form-item
        label="Usuário"
        name="_id"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="companyProfileDynamicValidateForm._id"
          id="input-user_id"

          disabled

        />
      </a-form-item>
      <a-form-item
        label="CNPJ"
        name="cnpj"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="companyProfileDynamicValidateForm.cnpj"
          id="input-cnpj"



        />
      </a-form-item>
      <a-form-item
        label="Razão social da empresa"
        name="companyName"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="companyProfileDynamicValidateForm.companyName"
          id="input-company_name"



        />
      </a-form-item>
      <a-form-item
        label="Nome fantasia da empresa"
        name="businessName"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="companyProfileDynamicValidateForm.businessName"
          id="input-business_name"



        />
      </a-form-item>
      <a-form-item
        label="Data de abertura"
        name="birthday"

      >
        <a-date-picker class="full-width"
          :disabled="permission === 'read'"
          v-model:value="companyProfileDynamicValidateForm.birthday"
          id="input-birthday"
          valueFormat="YYYY-MM-DD"


        />
      </a-form-item>
  <a-form-item
    label="Natureza legal"
    name="legalNature"

  >
    <a-select
        ref="select"
        v-model:value="companyProfileDynamicValidateForm.legalNature"
        id="select-legal_nature"
        placeholder="Natureza legal"




        :options="legalNatureOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
      <a-form-item
        label="Descrição da empresa"
        name="companyDescription"

      >
        <QuillEditor
          :enable="permission !== 'read'"
          ref="companyDescriptionRef"
          v-model:content="companyProfileDynamicValidateForm.companyDescription"
          id="input-company_description"
          contentType="html"  theme="snow" />
      </a-form-item>
      <div
      >
        <a-form-item
          label="Logo"
          name="logoImage"
        >
          <a-button
            :disabled="permission === 'read'"
            @click="$refs.logoImageFileInput.click()"
          >
            Upload
          </a-button>
          <input
            type="file"
            ref="logoImageFileInput"
            style="display: none"
            @change="(e) => handleFileChange(e, 'logoImage')"
          /><br /><br />
          <a-list
            size="small" bordered
            v-if="companyProfileDynamicValidateForm.logoImage?.length > 0"
            item-layout="horizontal"
            :data-source="companyProfileDynamicValidateForm.logoImage"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a key="remove-file"
                    @click="removeFile(item, 'logoImage')"
                  >Remover</a>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a :href="item.url" target="_blank">{{ item.filename }}</a>
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.url" />
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-form-item>
      </div>
      <div
      >
        <a-form-item
          label="Imagens da empresa"
          name="companyImages"
        >
          <a-button
            :disabled="permission === 'read'"
            @click="$refs.companyImagesFileInput.click()"
          >
            Upload
          </a-button>
          <input
            type="file"
            ref="companyImagesFileInput"
            style="display: none"
            @change="(e) => handleFileChange(e, 'companyImages')"
          /><br /><br />
          <a-list
            size="small" bordered
            v-if="companyProfileDynamicValidateForm.companyImages?.length > 0"
            item-layout="horizontal"
            :data-source="companyProfileDynamicValidateForm.companyImages"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a key="remove-file"
                    @click="removeFile(item, 'companyImages')"
                  >Remover</a>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a :href="item.url" target="_blank">{{ item.filename }}</a>
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.url" />
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-form-item>
      </div>
    <a-form-item
      label="Tag"
      name="tagId"

    >
      <a-select
        v-model:value="companyProfileDynamicValidateForm.tagId"
        id="autocomplete-tag_id"
        mode="multiple"
        label-in-value

        style="width: 100%"
        :filter-option="false"
        :not-found-content="tagIdOptions.fetching ? undefined : null"
        :options="tagIdOptions.data"
        :disabled="permission === 'read'"
        @search="onTagIdSearchDebounced"
        @change="onTagIdChange"
      >
        <template v-if="tagIdOptions.data.length">
          <a-select-option
            v-for="option in tagIdOptions.data"
            :key="option.id"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </template>
      </a-select>
    </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="partnersTab" tab="Sócios">
      <a-space
        v-for="(partner, partnersIndex) in companyProfileDynamicValidateForm.partners"
        :key="partnersIndex"
        style="display: flex; margin-bottom: 8px"
        align="baseline"
      >
        <a-card class='card'>
          <div>
    <a-form-item
      :label="'Pessoa ' + (partnersIndex + 1)"
      :name="`partner.personId_${partnersIndex}`"

    >
      <a-select
        v-model:value="partner.personId"
        id="autocomplete-person_id"
        show-search

        style="width: 100%"
        :default-active-first-option="false"
        :show-arrow="true"
        :filter-option="false"
        :not-found-content="null"
        :options="personIdOptions.data"
        :disabled="permission === 'read'"
        @search="onPersonIdSearchDebounced"
        @change="onPersonIdChange"
      ></a-select>
    </a-form-item>
          </div>
          <a-button
            v-if="permission == 'edit'"
            type="primary" danger block
            id="button-remove_partners"
            @click="removePartner(partner, companyProfileDynamicValidateForm.partners)"
          >
            <span class="material-symbols-outlined">
            delete
            </span>
            Remover Sócio
          </a-button>
        </a-card>
      </a-space>
      <a-form-item

      >
        <a-button
          v-if="permission == 'edit'"
          type="dashed" block
          id="button-add_partners"
          @click="addPartner(companyProfileDynamicValidateForm.partners)"
        >
          <span class="material-symbols-outlined">
          add_circle
          </span>
          Adicionar Sócio
        </a-button>
      </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="contactsTab" tab="Contatos">
      <a-space
        v-for="(contact, contactsIndex) in companyProfileDynamicValidateForm.contacts"
        :key="contactsIndex"
        style="display: flex; margin-bottom: 8px"
        align="baseline"
      >
        <a-card class='card'>
          <div>
  <a-form-item
    :label="'Tipo de contato ' + (contactsIndex + 1)"
    :name="`contact.contactType_${contactsIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="contact.contactType"
        id="select-contact_type"
        placeholder="Tipo de contato"

        required


        :options="contactTypeOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
      <a-form-item
        label="Contato"
        name="contact.contactValue"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="contact.contactValue"
          id="input-contact_value"



        />
      </a-form-item>
      <a-form-item
        label="Complemento do contato"
        name="contact.contactComplement"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="contact.contactComplement"
          id="input-contact_complement"



        />
      </a-form-item>
          </div>
          <a-button
            v-if="permission == 'edit'"
            type="primary" danger block
            id="button-remove_contacts"
            @click="removeContact(contact, companyProfileDynamicValidateForm.contacts)"
          >
            <span class="material-symbols-outlined">
            delete
            </span>
            Remover Contato
          </a-button>
        </a-card>
      </a-space>
      <a-form-item

      >
        <a-button
          v-if="permission == 'edit'"
          type="dashed" block
          id="button-add_contacts"
          @click="addContact(companyProfileDynamicValidateForm.contacts)"
        >
          <span class="material-symbols-outlined">
          add_circle
          </span>
          Adicionar Contato
        </a-button>
      </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="addressesTab" tab="Endereços">
      <div>
      <a-form-item
        label="CEP"
        name="addressFieldsetOne.addressOneCepBrasilApi"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetOne.addressOneCepBrasilApi"
          id="input-address_one_cep_brasil_api"


          @change="onAddressOneCepBrasilApiApiRequestDebounced(addressFieldsetOne.addressOneCepBrasilApi, addressFieldsetOne)"
        />
      </a-form-item>
  <a-form-item
    :label="'Tipo de endereço ' + (addressFieldsetOneIndex + 1)"
    :name="`addressFieldsetOne.addressOneType_${addressFieldsetOneIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="addressFieldsetOne.addressOneType"
        id="select-address_one_type"
        placeholder="Tipo de endereço"




        :options="addressOneTypeOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
      <a-form-item
        label="Logradouro"
        name="addressFieldsetOne.addressOneStreet"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetOne.addressOneStreet"
          id="input-address_one_street"
          placeholder="Ex.: Avenida Brasil"


        />
      </a-form-item>
      <a-form-item
        label="Número"
        name="addressFieldsetOne.addressOneNumber"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetOne.addressOneNumber"
          id="input-address_one_number"
          placeholder="Ex.: 410 ou 410-A ou S/N"


        />
      </a-form-item>
      <a-form-item
        label="Complemento"
        name="addressFieldsetOne.addressOneComplement"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetOne.addressOneComplement"
          id="input-address_one_complement"
          placeholder="Ex.: Ao lado da Igreja São Francisco"


        />
      </a-form-item>
      <a-form-item
        label="Cidade"
        name="addressFieldsetOne.addressOneCity"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetOne.addressOneCity"
          id="input-address_one_city"
          placeholder="Ex.: Maceió"


        />
      </a-form-item>
      <a-form-item
        label="Estado"
        name="addressFieldsetOne.addressOneState"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetOne.addressOneState"
          id="input-address_one_state"
          placeholder="Ex.: AL"


        />
      </a-form-item></div>
      <div>
      <a-form-item
        label="CEP"
        name="addressFieldsetTwo.addressTwoCepBrasilApi"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetTwo.addressTwoCepBrasilApi"
          id="input-address_two_cep_brasil_api"


          @change="onAddressTwoCepBrasilApiApiRequestDebounced(addressFieldsetTwo.addressTwoCepBrasilApi, addressFieldsetTwo)"
        />
      </a-form-item>
  <a-form-item
    :label="'Tipo de endereço ' + (addressFieldsetTwoIndex + 1)"
    :name="`addressFieldsetTwo.addressTwoType_${addressFieldsetTwoIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="addressFieldsetTwo.addressTwoType"
        id="select-address_two_type"
        placeholder="Tipo de endereço"




        :options="addressTwoTypeOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
      <a-form-item
        label="Logradouro"
        name="addressFieldsetTwo.addressTwoStreet"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetTwo.addressTwoStreet"
          id="input-address_two_street"
          placeholder="Ex.: Avenida Brasil"


        />
      </a-form-item>
      <a-form-item
        label="Número"
        name="addressFieldsetTwo.addressTwoNumber"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetTwo.addressTwoNumber"
          id="input-address_two_number"
          placeholder="Ex.: 410 ou 410-A ou S/N"


        />
      </a-form-item>
      <a-form-item
        label="Complemento"
        name="addressFieldsetTwo.addressTwoComplement"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetTwo.addressTwoComplement"
          id="input-address_two_complement"
          placeholder="Ex.: Ao lado da Igreja São Francisco"


        />
      </a-form-item>
      <a-form-item
        label="Cidade"
        name="addressFieldsetTwo.addressTwoCity"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetTwo.addressTwoCity"
          id="input-address_two_city"
          placeholder="Ex.: Maceió"


        />
      </a-form-item>
      <a-form-item
        label="Estado"
        name="addressFieldsetTwo.addressTwoState"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="addressFieldsetTwo.addressTwoState"
          id="input-address_two_state"
          placeholder="Ex.: AL"


        />
      </a-form-item></div>
        </a-tab-pane>
        <a-tab-pane key="bankDataTab" tab="Dados bancários">
      <div>
  <a-form-item
    :label="'Banco ' + (bankDataFieldsetOneIndex + 1)"
    :name="`bankDataFieldsetOne.bankDataBankNameOne_${bankDataFieldsetOneIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="bankDataFieldsetOne.bankDataBankNameOne"
        id="select-bank_data_bank_name_one"
        placeholder="Banco"




        :options="bankDataBankNameOneOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
      <a-form-item
        label="Agência"
        name="bankDataFieldsetOne.bankDataBankBranchOne"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="bankDataFieldsetOne.bankDataBankBranchOne"
          id="input-bank_data_bank_branch_one"



        />
      </a-form-item>
      <a-form-item
        label="Conta bancária"
        name="bankDataFieldsetOne.bankDataBankAccountOne"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="bankDataFieldsetOne.bankDataBankAccountOne"
          id="input-bank_data_bank_account_one"



        />
      </a-form-item>
  <a-form-item
    :label="'Tipo de conta ' + (bankDataFieldsetOneIndex + 1)"
    :name="`bankDataFieldsetOne.bankDataBankAccountTypeOne_${bankDataFieldsetOneIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="bankDataFieldsetOne.bankDataBankAccountTypeOne"
        id="select-bank_data_bank_account_type_one"
        placeholder="Tipo de conta"




        :options="bankDataBankAccountTypeOneOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item></div>
      <div>
  <a-form-item
    :label="'Banco ' + (bankDataFieldsetTwoIndex + 1)"
    :name="`bankDataFieldsetTwo.bankDataBankNameTwo_${bankDataFieldsetTwoIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="bankDataFieldsetTwo.bankDataBankNameTwo"
        id="select-bank_data_bank_name_two"
        placeholder="Banco"




        :options="bankDataBankNameTwoOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
      <a-form-item
        label="Agência"
        name="bankDataFieldsetTwo.bankDataBankBranchTwo"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="bankDataFieldsetTwo.bankDataBankBranchTwo"
          id="input-bank_data_bank_branch_two"



        />
      </a-form-item>
      <a-form-item
        label="Conta bancária"
        name="bankDataFieldsetTwo.bankDataBankAccountTwo"

      >
        <a-input
          :disabled="permission === 'read'"
          v-model:value="bankDataFieldsetTwo.bankDataBankAccountTwo"
          id="input-bank_data_bank_account_two"



        />
      </a-form-item>
  <a-form-item
    :label="'Tipo de conta ' + (bankDataFieldsetTwoIndex + 1)"
    :name="`bankDataFieldsetTwo.bankDataBankAccountTypeTwo_${bankDataFieldsetTwoIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="bankDataFieldsetTwo.bankDataBankAccountTypeTwo"
        id="select-bank_data_bank_account_type_two"
        placeholder="Tipo de conta"




        :options="bankDataBankAccountTypeTwoOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item></div>
        </a-tab-pane>
        <a-tab-pane key="relateFilesTab" tab="Arquivos relacionados">
      <a-space
        v-for="(relatedFile, relatedFilesIndex) in companyProfileDynamicValidateForm.relatedFiles"
        :key="relatedFilesIndex"
        style="display: flex; margin-bottom: 8px"
        align="baseline"
      >
        <a-card class='card'>
          <div>
      <a-form-item
        label="Descrição do arquivo"
        name="relatedFile.filesDescription"

      >
        <QuillEditor
          :enable="permission !== 'read'"
          ref="filesDescriptionRef"
          v-model:content="relatedFile.filesDescription"
          id="input-files_description"
          contentType="html"  theme="snow" />
      </a-form-item>
      <div
      >
        <a-form-item
          label="Arquivos do projeto"
          name="relatedFile.relatedFilesFiles"
        >
          <a-button
            :disabled="permission === 'read'"
            @click="$refs.relatedFilesFilesFileInput.click()"
          >
            Upload
          </a-button>
          <input
            type="file"
            ref="relatedFilesFilesFileInput"
            style="display: none"
            @change="(e) => handleFileChange(e, 'relatedFilesFiles')"
          /><br /><br />
          <a-list
            size="small" bordered
            v-if="companyProfileDynamicValidateForm.relatedFilesFiles?.length > 0"
            item-layout="horizontal"
            :data-source="companyProfileDynamicValidateForm.relatedFilesFiles"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a key="remove-file"
                    @click="removeFile(item, 'relatedFilesFiles')"
                  >Remover</a>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a :href="item.url" target="_blank">{{ item.filename }}</a>
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.url" />
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-form-item>
      </div>
  <a-form-item
    :label="'Dia de entrada no trabalho ' + (relatedFilesIndex + 1)"
    :name="`relatedFile.relatedFilesDateDay_${relatedFilesIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="relatedFile.relatedFilesDateDay"
        id="select-related_files_date_day"
        placeholder="Dia de entrada no trabalho"

        required


        :options="relatedFilesDateDayOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
  <a-form-item
    :label="'Mês de entrada no trabalho ' + (relatedFilesIndex + 1)"
    :name="`relatedFile.relatedFilesDateMonth_${relatedFilesIndex}`"

  >
    <a-select
        ref="select"
        v-model:value="relatedFile.relatedFilesDateMonth"
        id="select-related_files_date_month"
        placeholder="Mês de entrada no trabalho"

        required


        :options="relatedFilesDateMonthOptions"
        :disabled="permission === 'read'"
      ></a-select>
    </a-form-item>
      <a-form-item
        label="Ano do arquivo"
        name="relatedFile.relatedFilesDateYear"

      >
        <a-input-number
          :disabled="permission === 'read'"
          v-model:value="relatedFile.relatedFilesDateYear"
          id="input-related_files_date_year"


        />
      </a-form-item>
          </div>
          <a-button
            v-if="permission == 'edit'"
            type="primary" danger block
            id="button-remove_related_files"
            @click="removeRelatedFile(relatedFile, companyProfileDynamicValidateForm.relatedFiles)"
          >
            <span class="material-symbols-outlined">
            delete
            </span>
            Remover Arquivos relacionados
          </a-button>
        </a-card>
      </a-space>
      <a-form-item

      >
        <a-button
          v-if="permission == 'edit'"
          type="dashed" block
          id="button-add_related_files"
          @click="addRelatedFile(companyProfileDynamicValidateForm.relatedFiles)"
        >
          <span class="material-symbols-outlined">
          add_circle
          </span>
          Adicionar Arquivos relacionados
        </a-button>
      </a-form-item>
        </a-tab-pane>
      </a-tabs>
          <div v-if="permission == 'edit'">
            <a-button
              v-if="!$route.query._id"
              type="primary"
              id="button-form_save"
              @click="createCompanyProfile"
            >
              Salvar
            </a-button>
            <a-button
              v-if="$route.query._id"
              type="primary"
              id="button-form_update"
              @click="updateCompanyProfile($route.query._id as string)"
            >
              Atualizar
            </a-button>
          </div>
        </a-space>
      </a-form>
    </template>

    <style>

      /* you can make up upload button and sample style by using stylesheets */
      .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
      }

      .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
    </style>
      <script lang="ts" setup>
        import {
            ref,
            watch,
            reactive,
            onMounted,
        } from 'vue';
        import type {
          FormInstance,
          SelectProps,
        } from 'ant-design-vue';
        import { message } from 'ant-design-vue';
        import type { Rule } from 'ant-design-vue/es/form';
        import type { Dayjs } from 'dayjs';
        import axios from 'axios';
        import { useRoute, useRouter } from 'vue-router';
        // import jwt from 'jsonwebtoken';

        const route = useRoute();
        const router = useRouter();
        let validateCompanyProfileForm: [];

        const debounce = (func: Function, wait = 300, immediate = false) => {
          let timeout: any;
          return function (this: any, ...args: any[]) {
            const context = this;
            const later = function () {
              timeout = null;
              if (!immediate) func.apply(context, args);
            }
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
          }
        }

        onMounted(async () => {
          getPermissionFromToken();
          await router.isReady();
          if(!route.query._id) return;
          const response = await axios.get(
            `http://company-profile-kunlatek.ngrok.dev/companies-profiles/${route.query._id}`,
            {
              headers: {
                Authorization: sessionStorage.getItem('authToken')!,
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.data.statusCode !== 200) return;
          const data = response.data.data;
          for (const attr in data) { if (attr in companyProfileDynamicValidateForm) companyProfileDynamicValidateForm[attr] = data[attr];
          if (attr === 'partners' && data.partners) {
            companyProfileDynamicValidateForm.partners = data.partners.map((element: any) => ({
              ...element,
              personId: {
                label: `${element.personId.personName} - ${element.personId.cpf}`,
                value: element.personId?._id
              },
            }));
          }

          if (attr === 'tagId' && data.tagId) {
            companyProfileDynamicValidateForm.tagId = companyProfileDynamicValidateForm.tagId.map((element: any) => {
              return {
                label: `${element.tagName}`,
                value: element._id
              }
            });
          }
           };
        });

        const companyProfileFormRef = ref<FormInstance>();
        const companyProfileDynamicValidateForm: any = reactive<
          {
_id: String | null;
cnpj: String | null;
companyName: String | null;
businessName: String | null;
birthday: Number | null;
legalNature: String | null;
companyDescription: String | null;
logoImage: [] | null;
companyImages: [] | null;
tagId: [];
partners: Partners[];
personId: String | null;
contacts: Contacts[];
contactType: String | null;
contactValue: String | null;
contactComplement: String | null;
relatedFiles: RelatedFiles[];
filesDescription: String | null;
relatedFilesFiles: [] | null;
relatedFilesDateDay: number | null;
relatedFilesDateMonth: number | null;
relatedFilesDateYear: number | null;
          }
        > (
          {
_id: null,
cnpj: null,
companyName: null,
businessName: null,
birthday: null,
legalNature: null,
companyDescription: '<p></p>',
logoImage: [],
companyImages: [],
tagId: [],
partners: [],
personId: null,
contacts: [],
contactType: null,
contactValue: null,
contactComplement: null,
relatedFiles: [],
filesDescription: '<p></p>',
relatedFilesFiles: [],
relatedFilesDateDay: null,
relatedFilesDateMonth: null,
relatedFilesDateYear: null,
          }
        );

        const resetCompanyProfileForm = () => {
          Object.assign(companyProfileDynamicValidateForm, {
_id: null,
cnpj: null,
companyName: null,
businessName: null,
birthday: null,
legalNature: null,
companyDescription: '<p></p>',
logoImage: [],
companyImages: [],
tagId: [],
partners: [],
personId: null,
contacts: [],
contactType: null,
contactValue: null,
contactComplement: null,
relatedFiles: [],
filesDescription: '<p></p>',
relatedFilesFiles: [],
relatedFilesDateDay: null,
relatedFilesDateMonth: null,
relatedFilesDateYear: null,
          });

        };

        const handleFileChange = async (event: Event, attribute: string) => {
          message.loading({ content: 'Carregando...', key: 'upload', duration: 0 });
          const input = event.target as HTMLInputElement;
          if (input.files && input.files[0]) {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
              const response = await axios.post(`http://company-profile-kunlatek.ngrok.dev/companies-profiles/file`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: sessionStorage.getItem('authToken')!,
                },
              });
              companyProfileDynamicValidateForm[attribute] = [...companyProfileDynamicValidateForm[attribute], response.data.data];
              message.success({ content: 'Arquivo carregado com sucesso!', key: 'upload' });
            } catch (error) {
              console.error('Error uploading file:', error);
              message.error({ content: 'Erro ao carregar arquivo!', key: 'upload' });
            }
          } else {
            message.info({ content: 'Arquivo não carregado!', key: 'upload' });
          }
        };
        const removeFile = (item: any, attribute: string) => {
          companyProfileDynamicValidateForm[attribute] = (companyProfileDynamicValidateForm[attribute] as any[]).filter(imageData => imageData.fileId !== item.fileId);
        };

        const activeKey: any = ref('mainTab');
      const birthday = ref<Dayjs>();
  const legalNatureOptions = ref<SelectProps['options']>(
    [{"label":"Empresa Pública","value":"201-1"},{"label":"Sociedade de Economia Mista","value":"203-8"},{"label":"Sociedade Anônima Aberta","value":"204-6"},{"label":"Sociedade Anônima Fechada","value":"205-4"},{"label":"Sociedade Empresária Limitada","value":"206-2"},{"label":"Sociedade Empresária em Nome Coletivo","value":"207-0"},{"label":"Sociedade Empresária em Comandita Simples","value":"208-9"},{"label":"Sociedade Empresária em Comandita por Ações","value":"209-7"},{"label":"Sociedade em Conta de Participação","value":"212-7"},{"label":"Empresário(Individual)","value":"213-5"},{"label":"Cooperativa","value":"214-3"},{"label":"Consórcio de Sociedades","value":"215-1"},{"label":"Grupo de Sociedades","value":"216-0"},{"label":"Estabelecimento, no Brasil, de Sociedade Estrangeira","value":"217-8"},{"label":"Estabelecimento, no Brasil, de Empresa Binacional Argentino - Brasileira","value":"219-4"},{"label":"Empresa Domiciliada no Exterior","value":"221-6"},{"label":"Clube / Fundo de Investimento","value":"222-4"},{"label":"Sociedade Simples Pura","value":"223-2"},{"label":"Sociedade Simples Limitada","value":"224-0"},{"label":"Sociedade Simples em Nome Coletivo","value":"225-9"},{"label":"Sociedade Simples em Comandita Simples","value":"226-7"},{"label":"Empresa Binacional","value":"227-5"},{"label":"Consórcio de Empregadores","value":"228-3"},{"label":"Consórcio Simples","value":"229-1"},{"label":"Empresa Individual de Responsabilidade Limitada(de Natureza Empresária)","value":"230-5"},{"label":"Empresa Individual de Responsabilidade Limitada(de Natureza Simples)","value":"231-3"},{"label":"Sociedade Unipessoal de Advogados","value":"232-1"},{"label":"Cooperativas de Consumo","value":"233-0"},{"label":"Serviço Notarial e Registral(Cartório)","value":"303-4"},{"label":"Fundação Privada","value":"306-9"},{"label":"Serviço Social Autônomo","value":"307-7"},{"label":"Condomínio Edilício","value":"308-5"},{"label":"Comissão de Conciliação Prévia","value":"310-7"},{"label":"Entidade de Mediação e Arbitragem","value":"311-5"},{"label":"Entidade Sindical","value":"313-1"},{"label":"Estabelecimento, no Brasil, de Fundação ou Associação Estrangeiras","value":"320-4"},{"label":"Fundação ou Associação Domiciliada no Exterior","value":"321-2"},{"label":"Organização Religiosa","value":"322-0"},{"label":"Comunidade Indígena","value":"323-9"},{"label":"Fundo Privado","value":"324-7"},{"label":"Órgão de Direção Nacional de Partido Político","value":"325-5"},{"label":"Órgão de Direção Regional de Partido Político","value":"326-3"},{"label":"Órgão de Direção Local de Partido Político","value":"327-1"},{"label":"Comitê Financeiro de Partido Político","value":"328-0"},{"label":"Frente Plebiscitária ou Referendária","value":"329-8"},{"label":"Organização Social(OS)","value":"330-1"},{"label":"Demais Condomínios","value":"331-0"},{"label":"Associação Privada","value":"399-9"},{"label":"Empresa Individual Imobiliária","value":"401-4"},{"label":"Segurado Especial","value":"402-2"},{"label":"Contribuinte individual","value":"408-1"},{"label":"Candidato a Cargo Político Eletivo","value":"409-0"},{"label":"Leiloeiro","value":"411-1"},{"label":"Produtor Rural(Pessoa Física)","value":"412-0"},{"label":"Organização Internacional","value":"501-0"},{"label":"Representação Diplomática Estrangeira","value":"502-9"},{"label":"Outras Instituições Extraterritoriais","value":"503-7"},{"label":"Órgão Público do Poder Executivo Federal","value":"101-5"},{"label":"Órgão Público do Poder Executivo Estadual ou do Distrito Federal","value":"102-3"},{"label":"Órgão Público do Poder Executivo Municipal","value":"103-1"},{"label":"Órgão Público do Poder Legislativo Federal","value":"104-0"},{"label":"Órgão Público do Poder Legislativo Estadual ou do Distrito Federal","value":"105-8"},{"label":"Órgão Público do Poder Legislativo Municipal","value":"106-6"},{"label":"Órgão Público do Poder Judiciário Federal","value":"107-4"},{"label":"Órgão Público do Poder Judiciário Estadual","value":"108-2"},{"label":"Autarquia Federal","value":"110-4"},{"label":"Autarquia Estadual ou do Distrito Federal","value":"111-2"},{"label":"Autarquia Municipal","value":"112-0"},{"label":"Fundação Pública de Direito Público Federal","value":"113-9"},{"label":"Fundação Pública de Direito Público Estadual ou do Distrito Federal","value":"114-7"},{"label":"Fundação Pública de Direito Público Municipal","value":"115-5"},{"label":"Órgão Público Autônomo Federal","value":"116-3"},{"label":"Órgão Público Autônomo Estadual ou do Distrito Federal","value":"117-1"},{"label":"Órgão Público Autônomo Municipal","value":"118-0"},{"label":"Comissão Polinacional","value":"119-8"},{"label":"Fundo Público","value":"120-1"},{"label":"Consórcio Público de Direito Público(Associação Pública)","value":"121-0"},{"label":"Consórcio Público de Direito Privado","value":"122-8"},{"label":"Estado ou Distrito Federal","value":"123-6"},{"label":"Município","value":"124-4"},{"label":"Fundação Pública de Direito Privado Federal","value":"125-2"},{"label":"Fundação Pública de Direito Privado Estadual ou do Distrito Federal","value":"126-0"},{"label":"Fundação Pública de Direito Privado Municipal","value":"127-9"}]
  );
      const companyDescriptionRef: any = ref();
  const tagIdOptions: any = reactive({
    data: [],
    value: [],
    fetching: false,
  });

  const onTagIdChange = () => {};

  const onTagIdSearch = async(searchText:string) => {
    const response = await axios.get(`
      ${import.meta.env.VITE_BACKEND_ROOT_PATH}/tags?filter={"$or":[{"tagName":{"$regex": "${searchText}", "$options": "i"}}]}`,
      {
        headers: {
        Authorization: sessionStorage.getItem('authToken')!,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.statusCode !== 200) return;

    const body = response.data.data;

    const data = body.result.map((datum: any, index: number) => ({
      id: `autocomplete-tag_id_${index}`,
      label: `${datum.tagName}`,
      value: datum._id
    }));

    tagIdOptions.data = data;
    tagIdOptions.fetching = tagIdOptions.data.length > 0;
  };

  const onTagIdSearchDebounced = debounce(onTagIdSearch, 500);

    interface Partners {

personId: String | null;
    };

    const removePartner = (item: Partners, partners: Partners[]) => {
      const index = partners.indexOf(item);
      if (index !== -1) {
        partners.splice(index, 1);
      }
    };
    const addPartner = (partners: Partners[]) => {
      partners.push({

personId: null,
      });
    };
  const personIdOptions: any = reactive({
    data: [],
    value: [],
    fetching: false,
  });

  const onPersonIdChange = () => {};

  const onPersonIdSearch = async(searchText:string) => {
    const response = await axios.get(`
      ${import.meta.env.VITE_BACKEND_ROOT_PATH}/people?filter={"$or":[{"personName":{"$regex": "${searchText}", "$options": "i"}}, {"cpf":{"$regex": "${searchText}", "$options": "i"}}]}`,
      {
        headers: {
        Authorization: sessionStorage.getItem('authToken')!,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.statusCode !== 200) return;

    const body = response.data.data;

    const data = body.result.map((datum: any, index: number) => ({
      id: `autocomplete-person_id_${index}`,
      label: `${datum.personName} - ${datum.cpf}`,
      value: datum._id
    }));

    personIdOptions.data = data;
    personIdOptions.fetching = personIdOptions.data.length > 0;
  };

  const onPersonIdSearchDebounced = debounce(onPersonIdSearch, 500);

    interface Contacts {

contactType: String | null;
contactValue: String | null;
contactComplement: String | null;
    };

    const removeContact = (item: Contacts, contacts: Contacts[]) => {
      const index = contacts.indexOf(item);
      if (index !== -1) {
        contacts.splice(index, 1);
      }
    };
    const addContact = (contacts: Contacts[]) => {
      contacts.push({

contactType: null,
contactValue: null,
contactComplement: null,
      });
    };
  const contactTypeOptions = ref<SelectProps['options']>(
    [{"label":"Celular","value":"mobile"},{"label":"E-mail","value":"email"},{"label":"Site","value":"website"},{"label":"Linkedin","value":"linkedin"},{"label":"Instagram","value":"instagram"},{"label":"Facebook","value":"facebook"}]
  );
    interface RelatedFiles {

filesDescription: String | null;
relatedFilesFiles: File | null;
relatedFilesDateDay: Number | null;
relatedFilesDateMonth: Number | null;
relatedFilesDateYear: Number | null;
    };

    const removeRelatedFile = (item: RelatedFiles, relatedFiles: RelatedFiles[]) => {
      const index = relatedFiles.indexOf(item);
      if (index !== -1) {
        relatedFiles.splice(index, 1);
      }
    };
    const addRelatedFile = (relatedFiles: RelatedFiles[]) => {
      relatedFiles.push({

filesDescription: null,
relatedFilesFiles: null,
relatedFilesDateDay: null,
relatedFilesDateMonth: null,
relatedFilesDateYear: null,
      });
    };
      const filesDescriptionRef: any = ref();
  const relatedFilesDateDayOptions = ref<SelectProps['options']>(
    [{"label":"01","value":1},{"label":"02","value":2},{"label":"03","value":3},{"label":"04","value":4},{"label":"05","value":5},{"label":"06","value":6},{"label":"07","value":7},{"label":"08","value":8},{"label":"09","value":9},{"label":"10","value":10},{"label":"11","value":11},{"label":"12","value":12},{"label":"13","value":13},{"label":"14","value":14},{"label":"15","value":15},{"label":"16","value":16},{"label":"17","value":17},{"label":"18","value":18},{"label":"19","value":19},{"label":"20","value":20},{"label":"21","value":21},{"label":"22","value":22},{"label":"23","value":23},{"label":"24","value":24},{"label":"25","value":25},{"label":"26","value":26},{"label":"27","value":27},{"label":"28","value":28},{"label":"29","value":29},{"label":"30","value":30},{"label":"31","value":31}]
  );
  const relatedFilesDateMonthOptions = ref<SelectProps['options']>(
    [{"label":"Janeiro","value":1},{"label":"Fevereiro","value":2},{"label":"Março","value":3},{"label":"Abril","value":4},{"label":"Maio","value":5},{"label":"Junho","value":6},{"label":"Julho","value":7},{"label":"Agosto","value":8},{"label":"Setembro","value":9},{"label":"Outubro","value":10},{"label":"Novembro","value":11},{"label":"Dezembro","value":12}]
  );

        const onFinish = (values: any) => {
          console.info('Success:', values);
        };

        const onFinishFailed = (errorInfo: any) => {
          console.info('Failed:', errorInfo);
        };


      const _idRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const companyNameRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const businessNameRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const personIdRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const contactTypeRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const contactValueRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const contactComplementRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const filesDescriptionRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const relatedFilesFilesRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const relatedFilesDateDayRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const relatedFilesDateMonthRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const relatedFilesDateYearRequiredValidator = async (_rule: Rule, value: any) => {
        if (!value || value === '') return Promise.reject('Campo obrigatório.');
      };
      const relatedFilesDateYearMaxLengthValidator = async (_rule: Rule, value: any) => {
          if (value?.length > 4) return Promise.reject('Máximo de 4 caracteres.');
        };
      const relatedFilesDateYearMinLengthValidator = async (_rule: Rule, value: any) => {
          if (value?.length < 4) return Promise.reject('Mínimo de 4 caracteres.');
        };

        const companyProfileRules: Record<string, Rule[]> = {_id: [{validator: _idRequiredValidator, trigger: 'blur'},],cnpj: [],companyName: [{validator: companyNameRequiredValidator, trigger: 'blur'},],businessName: [{validator: businessNameRequiredValidator, trigger: 'blur'},],birthday: [],legalNature: [],companyDescription: [],logoImage: [],companyImages: [],tagId: [],personId: [{validator: personIdRequiredValidator, trigger: 'blur'},],contactType: [{validator: contactTypeRequiredValidator, trigger: 'blur'},],contactValue: [{validator: contactValueRequiredValidator, trigger: 'blur'},],contactComplement: [{validator: contactComplementRequiredValidator, trigger: 'blur'},],filesDescription: [{validator: filesDescriptionRequiredValidator, trigger: 'blur'},],relatedFilesFiles: [{validator: relatedFilesFilesRequiredValidator, trigger: 'blur'},],relatedFilesDateDay: [{validator: relatedFilesDateDayRequiredValidator, trigger: 'blur'},],relatedFilesDateMonth: [{validator: relatedFilesDateMonthRequiredValidator, trigger: 'blur'},],relatedFilesDateYear: [{validator: relatedFilesDateYearRequiredValidator, trigger: 'blur'},{validator: relatedFilesDateYearMaxLengthValidator, trigger: 'blur'},{validator: relatedFilesDateYearMinLengthValidator, trigger: 'blur'},],};
        const handleCompanyProfileValidate = (...args: any) => {
          validateCompanyProfileForm = args;
        };

        const createCompanyProfile = async () => {
          try {
            if (validateCompanyProfileForm?.filter(item => item === false).length > 0) {
              return message.error({ content: 'Erro no preenchimento do formulário.', key: 'saveMessage' });
            }

            const payload = {
              ...companyProfileDynamicValidateForm,
              tagId: companyProfileDynamicValidateForm.tagId?.map((element: any) => element.value),
              partners: companyProfileDynamicValidateForm.partners.map(
                (partner: any) => {
                return {
                  ...partner,

                personId: typeof partner.personId === 'object'
                ? partner.personId.value
                : partner.personId,

              }
            }),
              contacts: companyProfileDynamicValidateForm.contacts.map(
                (contact: any) => {
                return {
                  ...contact,

              }
            }),
              relatedFiles: companyProfileDynamicValidateForm.relatedFiles.map(
                (relatedFile: any) => {
                return {
                  ...relatedFile,

              }
            }),
            };

            message.loading({ content: 'Salvando dados...', key: 'saveMessage' });
            const response = await axios.post(
              `http://company-profile-kunlatek.ngrok.dev/companies-profiles`,
              payload,
              {
                headers: {
                  Authorization: sessionStorage.getItem('authToken')!,
                  'Content-Type': 'application/json'
                }
              }
            );
            if (response.data.statusCode !== 201) return message.error({ content: 'Erro ao salvar os dados.', key: 'saveMessage' });
            message.success({ content: 'Dados salvos com sucesso.', key: 'saveMessage' });
            resetCompanyProfileForm();
          } catch (e: any) {
            message.error({ content: 'Erro ao salvar os dados.', key: 'saveMessage' });
            console.error(e.message);
          }
        }

        const updateCompanyProfile = async (id: string) => {
          try {
            if (validateCompanyProfileForm?.filter(item => item === false).length > 0) {
              return message.error({ content: 'Erro no preenchimento do formulário.', key: 'saveMessage' });
            }

            const payload = {
              ...companyProfileDynamicValidateForm,
              tagId: companyProfileDynamicValidateForm.tagId?.map((element: any) => element.value),
              partners: companyProfileDynamicValidateForm.partners.map(
                (partner: any) => {
                return {
                  ...partner,

                personId: typeof partner.personId === 'object'
                ? partner.personId.value
                : partner.personId,

              }
            }),
              contacts: companyProfileDynamicValidateForm.contacts.map(
                (contact: any) => {
                return {
                  ...contact,

              }
            }),
              relatedFiles: companyProfileDynamicValidateForm.relatedFiles.map(
                (relatedFile: any) => {
                return {
                  ...relatedFile,

              }
            }),
            };

            message.loading({ content: 'Atualizando dados...', key: 'saveMessage' });
            const response = await axios.put(
              `http://company-profile-kunlatek.ngrok.dev/companies-profiles/${id}`,
              payload,
              {
                headers: {
                  Authorization: sessionStorage.getItem('authToken')!,
                  'Content-Type': 'application/json'
                }
              }
            );
            if (response.data.statusCode !== 200) return message.error({ content: 'Erro ao salvar os dados.', key: 'saveMessage' });
            message.success({ content: 'Dados atualizados com sucesso.', key: 'saveMessage' });
            router.push('/company-profile-list');
          } catch (e: any) {
            message.error({ content: 'Erro ao atualizar os dados.', key: 'saveMessage' });
            console.error(e.message);
          }
        }

        const permission: any = ref<string>('read');
        const userId: any = ref<string>(null);
        const getPermissionFromToken = () => {
          const token = sessionStorage.getItem('authToken');
          if (!token) return;

          try {
            const decodedToken: any = jwtDecode(token.split(' ')[1]);
            permission.value = decodedToken.permission;
            userId.value = decodedToken.userId;

            companyProfileDynamicValidateForm._id = userId.value;
          } catch (error) {
            console.error('Failed to decode token:', error);
          }
        };
      </script>
