<template>
  <a-form ref="personProfileFormRef" name="dynamic_form_person_profile" autocomplete="off" layout="vertical"
    :model="personProfileDynamicValidateForm" :rules="personProfileRules" @validate="handlePersonProfileValidate"
    @finish="onFinish" @finishFailed="onFinishFailed">
    <a-space direction="vertical" class="relative-child">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="mainTab" tab="Dados principais">
          <a-form-item label="Usuário" name="_id">
            <a-input :disabled="true" v-model:value="personProfileDynamicValidateForm._id" id="input-user_id"
              disabled />
          </a-form-item>
          <a-form-item label="Nome da pessoa" name="personName">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.personName"
              id="input-person_name" />
          </a-form-item>
          <a-form-item label="Nome social" name="personNickname">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.personNickname"
              id="input-person_nickname" />
          </a-form-item>
          <a-form-item label="Gênero" name="gender">
            <a-select ref="select" v-model:value="personProfileDynamicValidateForm.gender" id="select-gender"
              placeholder="Gênero" required :options="genderOptions" :disabled="permission === 'read'"></a-select>
          </a-form-item>
          <a-form-item label="Data de nascimento" name="birthday">
            <a-date-picker class="full-width" :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.birthday" id="input-birthday" valueFormat="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item label="Descrição da pessoa" name="personDescription">
            <QuillEditor :enable="permission !== 'read'" ref="personDescriptionRef"
              v-model:content="personProfileDynamicValidateForm.personDescription" id="input-person_description"
              contentType="html" theme="snow" />
          </a-form-item>
          <a-form-item label="Estado civil" name="maritalStatus">
            <a-select ref="select" v-model:value="personProfileDynamicValidateForm.maritalStatus"
              id="select-marital_status" placeholder="Estado civil" :options="maritalStatusOptions"
              :disabled="permission === 'read'"></a-select>
          </a-form-item>
          <a-form-item label="Nome da mãe" name="motherName">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.motherName"
              id="input-mother_name" />
          </a-form-item>
          <a-form-item label="Nome do pai" name="fatherName">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.fatherName"
              id="input-father_name" />
          </a-form-item>
          <a-form-item label="Tag" name="tagId">
            <a-select v-model:value="personProfileDynamicValidateForm.tagId" id="autocomplete-tag_id" mode="multiple"
              label-in-value style="width: 100%" :filter-option="false"
              :not-found-content="tagIdOptions.fetching ? undefined : null" :options="tagIdOptions.data"
              :disabled="permission === 'read'" @search="onTagIdSearchDebounced" @change="onTagIdChange">
              <template v-if="tagIdOptions.data.length">
                <a-select-option v-for="option in tagIdOptions.data" :key="option.id" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </template>
            </a-select>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="documentsTab" tab="Documentos">
          <a-form-item label="CPF" name="cpf">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.cpf"
              id="input-cpf" />
          </a-form-item>
          <div>
            <a-form-item label="Arquivo do CPF" name="cpfFile">
              <a-button :disabled="permission === 'read'" @click="$refs.cpfFileFileInput.click()">
                Upload
              </a-button>
              <input type="file" ref="cpfFileFileInput" style="display: none"
                @change="(e) => handleFileChange(e, 'cpfFile')" /><br /><br />
              <a-list size="small" bordered v-if="personProfileDynamicValidateForm.cpfFile?.length > 0"
                item-layout="horizontal" :data-source="personProfileDynamicValidateForm.cpfFile">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <template #actions>
                      <a key="remove-file" @click="removeFile(item, 'cpfFile')">Remover</a>
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
          <a-form-item label="Número do RG" name="rg">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.rg"
              id="input-rg" />
          </a-form-item>
          <a-form-item label="Órgão de expedição do RG" name="rgIssuingAuthority">
            <a-input :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.rgIssuingAuthority" id="input-rg_issuing_authority" />
          </a-form-item>
          <a-form-item label="Data de emissão" name="rgIssuanceDate">
            <a-date-picker class="full-width" :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.rgIssuanceDate" id="input-rg_issuance_date"
              valueFormat="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item label="Estado do RG" name="rgState">
            <a-select ref="select" v-model:value="personProfileDynamicValidateForm.rgState" id="select-rg_state"
              placeholder="Estado do RG" :options="rgStateOptions" :disabled="permission === 'read'"></a-select>
          </a-form-item>
          <div>
            <a-form-item label="Arquivo do RG" name="rgFile">
              <a-button :disabled="permission === 'read'" @click="$refs.rgFileFileInput.click()">
                Upload
              </a-button>
              <input type="file" ref="rgFileFileInput" style="display: none"
                @change="(e) => handleFileChange(e, 'rgFile')" /><br /><br />
              <a-list size="small" bordered v-if="personProfileDynamicValidateForm.rgFile?.length > 0"
                item-layout="horizontal" :data-source="personProfileDynamicValidateForm.rgFile">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <template #actions>
                      <a key="remove-file" @click="removeFile(item, 'rgFile')">Remover</a>
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
          <a-form-item label="Número do passaporte" name="passport">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.passport"
              id="input-passport" />
          </a-form-item>
          <a-form-item label="Data de emissão" name="passportIssuanceDate">
            <a-date-picker class="full-width" :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.passportIssuanceDate" id="input-passport_issuance_date"
              valueFormat="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item label="Data de validade" name="passportExpirationDate">
            <a-date-picker class="full-width" :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.passportExpirationDate"
              id="input-passport_expiration_date" valueFormat="YYYY-MM-DD" />
          </a-form-item>
          <div>
            <a-form-item label="Arquivo do passaporte" name="passportFile">
              <a-button :disabled="permission === 'read'" @click="$refs.passportFileFileInput.click()">
                Upload
              </a-button>
              <input type="file" ref="passportFileFileInput" style="display: none"
                @change="(e) => handleFileChange(e, 'passportFile')" /><br /><br />
              <a-list size="small" bordered v-if="personProfileDynamicValidateForm.passportFile?.length > 0"
                item-layout="horizontal" :data-source="personProfileDynamicValidateForm.passportFile">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <template #actions>
                      <a key="remove-file" @click="removeFile(item, 'passportFile')">Remover</a>
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
        </a-tab-pane>
        <a-tab-pane key="contactsTab" tab="Contatos">
          <a-form-item label="Telefone principal" name="phoneNumberOne">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.phoneNumberOne"
              id="input-phone_number_one" />
          </a-form-item>
          <a-form-item label="Telefone secundário" name="phoneNumberTwo">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.phoneNumberTwo"
              id="input-phone_number_two" />
          </a-form-item>
          <a-form-item label="E-mail principal" name="emailOne">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.emailOne"
              id="input-email_one" />
          </a-form-item>
          <a-form-item label="E-mail secundário" name="emailTwo">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.emailTwo"
              id="input-email_two" />
          </a-form-item>
          <a-form-item label="Linkedin" name="linkedin">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.linkedin"
              id="input-linkedin" />
          </a-form-item>
          <a-form-item label="Instagram" name="instagram">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.instagram"
              id="input-instagram" />
          </a-form-item>
          <a-form-item label="Facebook" name="facebook">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.facebook"
              id="input-facebook" />
          </a-form-item>
          <a-form-item label="Facebook" name="x">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.x"
              id="input-x" />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="addressesTab" tab="Endereços">
          <a-form-item label="CEP" name="addressOneCepBrasilApi">
            <a-input :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.addressOneCepBrasilApi"
              id="input-address_one_cep_brasil_api"
              @change="onAddressOneCepBrasilApiApiRequestDebounced(personProfileDynamicValidateForm.addressOneCepBrasilApi)" />
          </a-form-item>
          <a-form-item label="Tipo de endereço" name="addressOneType">
            <a-select ref="select" v-model:value="personProfileDynamicValidateForm.addressOneType"
              id="select-address_one_type" placeholder="Tipo de endereço" :options="addressOneTypeOptions"
              :disabled="permission === 'read'"></a-select>
          </a-form-item>
          <a-form-item label="Logradouro" name="addressOneStreet">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressOneStreet"
              id="input-address_one_street" placeholder="Ex.: Avenida Brasil" />
          </a-form-item>
          <a-form-item label="Número" name="addressOneNumber">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressOneNumber"
              id="input-address_one_number" placeholder="Ex.: 410 ou 410-A ou S/N" />
          </a-form-item>
          <a-form-item label="Complemento" name="addressOneComplement">
            <a-input :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.addressOneComplement" id="input-address_one_complement"
              placeholder="Ex.: Ao lado da Igreja São Francisco" />
          </a-form-item>
          <a-form-item label="Cidade" name="addressOneCity">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressOneCity"
              id="input-address_one_city" placeholder="Ex.: Maceió" />
          </a-form-item>
          <a-form-item label="Estado" name="addressOneState">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressOneState"
              id="input-address_one_state" placeholder="Ex.: AL" />
          </a-form-item>
          <a-form-item label="CEP" name="addressTwoCepBrasilApi">
            <a-input :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.addressTwoCepBrasilApi"
              id="input-address_two_cep_brasil_api"
              @change="onAddressTwoCepBrasilApiApiRequestDebounced(personProfileDynamicValidateForm.addressTwoCepBrasilApi)" />
          </a-form-item>
          <a-form-item label="Tipo de endereço" name="addressTwoType">
            <a-select ref="select" v-model:value="personProfileDynamicValidateForm.addressTwoType"
              id="select-address_two_type" placeholder="Tipo de endereço" :options="addressTwoTypeOptions"
              :disabled="permission === 'read'"></a-select>
          </a-form-item>
          <a-form-item label="Logradouro" name="addressTwoStreet">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressTwoStreet"
              id="input-address_two_street" placeholder="Ex.: Avenida Brasil" />
          </a-form-item>
          <a-form-item label="Número" name="addressTwoNumber">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressTwoNumber"
              id="input-address_two_number" placeholder="Ex.: 410 ou 410-A ou S/N" />
          </a-form-item>
          <a-form-item label="Complemento" name="addressTwoComplement">
            <a-input :disabled="permission === 'read'"
              v-model:value="personProfileDynamicValidateForm.addressTwoComplement" id="input-address_two_complement"
              placeholder="Ex.: Ao lado da Igreja São Francisco" />
          </a-form-item>
          <a-form-item label="Cidade" name="addressTwoCity">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressTwoCity"
              id="input-address_two_city" placeholder="Ex.: Maceió" />
          </a-form-item>
          <a-form-item label="Estado" name="addressTwoState">
            <a-input :disabled="permission === 'read'" v-model:value="personProfileDynamicValidateForm.addressTwoState"
              id="input-address_two_state" placeholder="Ex.: AL" />
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="jobsTab" tab="Dados profissionais">
          <a-space v-for="(profession, professionsIndex) in personProfileDynamicValidateForm.professions"
            :key="professionsIndex" style="display: flex; margin-bottom: 8px" align="baseline">
            <a-card class='card'>
              <div>
                <a-form-item :label="'Ocupação ' + (professionsIndex + 1)"
                  :name="`profession.jobId_${professionsIndex}`">
                  <a-select v-model:value="profession.jobId" id="autocomplete-job_id" show-search style="width: 100%"
                    :default-active-first-option="false" :show-arrow="true" :filter-option="false"
                    :not-found-content="null" :options="jobIdOptions.data" :disabled="permission === 'read'"
                    @search="onJobIdSearchDebounced" @change="onJobIdChange"></a-select>
                </a-form-item>
                <a-form-item label="Mês de entrada no trabalho" name="profession.jobStartDateMonth">
                  <a-input-number :disabled="permission === 'read'" v-model:value="profession.jobStartDateMonth"
                    id="input-job_start_date_month" />
                </a-form-item>
                <a-form-item label="Ano de entrada no trabalho" name="profession.jobStartDateYear">
                  <a-input-number :disabled="permission === 'read'" v-model:value="profession.jobStartDateYear"
                    id="input-job_start_date_year" />
                </a-form-item>
                <a-form-item label="Ano de saída do trabalho" name="profession.jobFinishDateYear">
                  <a-input-number :disabled="permission === 'read'" v-model:value="profession.jobFinishDateYear"
                    id="input-job_finish_date_year" />
                </a-form-item>
                <a-form-item label="Mês de saída do trabalho" name="profession.jobFinishDateMonth">
                  <a-input-number :disabled="permission === 'read'" v-model:value="profession.jobFinishDateMonth"
                    id="input-job_finish_date_month" />
                </a-form-item>
                <a-form-item label="Descrição da ocupação" name="profession.jobDescription">
                  <QuillEditor :enable="permission !== 'read'" ref="jobDescriptionRef"
                    v-model:content="profession.jobDescription" id="input-job_description" contentType="html"
                    theme="snow" />
                </a-form-item>
              </div>
              <a-button v-if="permission == 'edit'" type="primary" danger block id="button-remove_professions"
                @click="removeProfession(profession, personProfileDynamicValidateForm.professions)">
                <span class="material-symbols-outlined">
                  delete
                </span>
                Remover Profissão
              </a-button>
            </a-card>
          </a-space>
          <a-form-item>
            <a-button v-if="permission == 'edit'" type="dashed" block id="button-add_professions"
              @click="addProfession(personProfileDynamicValidateForm.professions)">
              <span class="material-symbols-outlined">
                add_circle
              </span>
              Adicionar Profissão
            </a-button>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="educationTab" tab="Dados profissionais">
          <a-form-item label="Escolaridade" name="personEducation">
            <a-select ref="select" v-model:value="personProfileDynamicValidateForm.personEducation"
              id="select-person_education" placeholder="Escolaridade" @change="[checkPersonEducationsCondition(),]"
              :options="personEducationOptions" :disabled="permission === 'read'"></a-select>
          </a-form-item>
          <a-space v-for="(personEducation, personEducationsIndex) in personProfileDynamicValidateForm.personEducations"
            :key="personEducationsIndex" style="display: flex; margin-bottom: 8px" align="baseline">
            <a-card class='card'>
              <div>
                <a-form-item label="Curso" name="personEducation.personEducationCourse">
                  <a-input :disabled="permission === 'read'" v-model:value="personEducation.personEducationCourse"
                    id="input-person_education_course" />
                </a-form-item>
                <a-form-item label="Instituição" name="personEducation.personEducationInstitution">
                  <a-input :disabled="permission === 'read'" v-model:value="personEducation.personEducationInstitution"
                    id="input-person_education_institution" />
                </a-form-item>
                <a-form-item :label="'Data de início ' + (personEducationsIndex + 1)"
                  :name="`personEducation.personEducationStartDate_${personEducationsIndex}`">
                  <a-date-picker class="full-width" :disabled="permission === 'read'"
                    v-model:value="personEducation.personEducationStartDate" id="input-person_education_start_date"
                    valueFormat="YYYY-MM-DD" />
                </a-form-item>
                <a-form-item :label="'Data de término ' + (personEducationsIndex + 1)"
                  :name="`personEducation.personEducationFinishDate_${personEducationsIndex}`">
                  <a-date-picker class="full-width" :disabled="permission === 'read'"
                    v-model:value="personEducation.personEducationFinishDate" id="input-person_education_finish_date"
                    valueFormat="YYYY-MM-DD" />
                </a-form-item>
                <a-form-item label="Descrição do curso" name="personEducation.personEducationDescription">
                  <QuillEditor :enable="permission !== 'read'" ref="personEducationDescriptionRef"
                    v-model:content="personEducation.personEducationDescription" id="input-person_education_description"
                    contentType="html" theme="snow" />
                </a-form-item>
                <div>
                  <a-form-item label="Certificado" name="personEducation.personEducationCertificateFile">
                    <a-button :disabled="permission === 'read'"
                      @click="$refs.personEducationCertificateFileFileInput.click()">
                      Upload
                    </a-button>
                    <input type="file" ref="personEducationCertificateFileFileInput" style="display: none"
                      @change="(e) => handleFileChange(e, 'personEducationCertificateFile')" /><br /><br />
                    <a-list size="small" bordered
                      v-if="personProfileDynamicValidateForm.personEducationCertificateFile?.length > 0"
                      item-layout="horizontal"
                      :data-source="personProfileDynamicValidateForm.personEducationCertificateFile">
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <template #actions>
                            <a key="remove-file" @click="removeFile(item, 'personEducationCertificateFile')">Remover</a>
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
              </div>
              <a-button v-if="permission == 'edit'" type="primary" danger block id="button-remove_person_educations"
                @click="removePersonEducation(personEducation, personProfileDynamicValidateForm.personEducations)">
                <span class="material-symbols-outlined">
                  delete
                </span>
                Remover Formação
              </a-button>
            </a-card>
          </a-space>
          <a-form-item v-if="personEducationsCondition">
            <a-button v-if="permission == 'edit'" type="dashed" block id="button-add_person_educations"
              @click="addPersonEducation(personProfileDynamicValidateForm.personEducations)">
              <span class="material-symbols-outlined">
                add_circle
              </span>
              Adicionar Formação
            </a-button>
          </a-form-item>
          <a-space v-for="(personCourse, personCoursesIndex) in personProfileDynamicValidateForm.personCourses"
            :key="personCoursesIndex" style="display: flex; margin-bottom: 8px" align="baseline">
            <a-card class='card'>
              <div>
                <a-form-item label="Curso" name="personCourse.personCourseName">
                  <a-input :disabled="permission === 'read'" v-model:value="personCourse.personCourseName"
                    id="input-person_course_name" />
                </a-form-item>
                <a-form-item label="Instituição" name="personCourse.personCourseInstitution">
                  <a-input :disabled="permission === 'read'" v-model:value="personCourse.personCourseInstitution"
                    id="input-person_course_institution" />
                </a-form-item>
                <a-form-item :label="'Data de início ' + (personCoursesIndex + 1)"
                  :name="`personCourse.personCourseStartDate_${personCoursesIndex}`">
                  <a-date-picker class="full-width" :disabled="permission === 'read'"
                    v-model:value="personCourse.personCourseStartDate" id="input-person_course_start_date"
                    valueFormat="YYYY-MM-DD" />
                </a-form-item>
                <a-form-item :label="'Data de término ' + (personCoursesIndex + 1)"
                  :name="`personCourse.personCourseFinishDate_${personCoursesIndex}`">
                  <a-date-picker class="full-width" :disabled="permission === 'read'"
                    v-model:value="personCourse.personCourseFinishDate" id="input-person_course_finish_date"
                    valueFormat="YYYY-MM-DD" />
                </a-form-item>
                <a-form-item label="Descrição do curso" name="personCourse.personCourseDescription">
                  <QuillEditor :enable="permission !== 'read'" ref="personCourseDescriptionRef"
                    v-model:content="personCourse.personCourseDescription" id="input-person_course_description"
                    contentType="html" theme="snow" />
                </a-form-item>
                <div>
                  <a-form-item label="Certificado" name="personCourse.personCourseCertificateFile">
                    <a-button :disabled="permission === 'read'"
                      @click="$refs.personCourseCertificateFileFileInput.click()">
                      Upload
                    </a-button>
                    <input type="file" ref="personCourseCertificateFileFileInput" style="display: none"
                      @change="(e) => handleFileChange(e, 'personCourseCertificateFile')" /><br /><br />
                    <a-list size="small" bordered
                      v-if="personProfileDynamicValidateForm.personCourseCertificateFile?.length > 0"
                      item-layout="horizontal"
                      :data-source="personProfileDynamicValidateForm.personCourseCertificateFile">
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <template #actions>
                            <a key="remove-file" @click="removeFile(item, 'personCourseCertificateFile')">Remover</a>
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
              </div>
              <a-button v-if="permission == 'edit'" type="primary" danger block id="button-remove_person_courses"
                @click="removePersonCourse(personCourse, personProfileDynamicValidateForm.personCourses)">
                <span class="material-symbols-outlined">
                  delete
                </span>
                Remover Cursos
              </a-button>
            </a-card>
          </a-space>
          <a-form-item>
            <a-button v-if="permission == 'edit'" type="dashed" block id="button-add_person_courses"
              @click="addPersonCourse(personProfileDynamicValidateForm.personCourses)">
              <span class="material-symbols-outlined">
                add_circle
              </span>
              Adicionar Cursos
            </a-button>
          </a-form-item>
          <a-form-item label="Idiomas" name="personLanguages">
            <a-select ref="select" v-model:value="personProfileDynamicValidateForm.personLanguages"
              id="select-person_languages" placeholder="Idiomas" :options="personLanguagesOptions"
              :disabled="permission === 'read'"></a-select>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="bankDataTab" tab="Dados bancários">
          <div>
            <a-form-item :label="'Banco ' + (bankDataFieldsetOneIndex + 1)"
              :name="`bankDataFieldsetOne.bankDataBankNameOne_${bankDataFieldsetOneIndex}`">
              <a-select ref="select" v-model:value="bankDataFieldsetOne.bankDataBankNameOne"
                id="select-bank_data_bank_name_one" placeholder="Banco" :options="bankDataBankNameOneOptions"
                :disabled="permission === 'read'"></a-select>
            </a-form-item>
            <a-form-item label="Agência" name="bankDataFieldsetOne.bankDataBankBranchOne">
              <a-input :disabled="permission === 'read'" v-model:value="bankDataFieldsetOne.bankDataBankBranchOne"
                id="input-bank_data_bank_branch_one" />
            </a-form-item>
            <a-form-item label="Conta bancária" name="bankDataFieldsetOne.bankDataBankAccountOne">
              <a-input :disabled="permission === 'read'" v-model:value="bankDataFieldsetOne.bankDataBankAccountOne"
                id="input-bank_data_bank_account_one" />
            </a-form-item>
            <a-form-item :label="'Tipo de conta ' + (bankDataFieldsetOneIndex + 1)"
              :name="`bankDataFieldsetOne.bankDataBankAccountTypeOne_${bankDataFieldsetOneIndex}`">
              <a-select ref="select" v-model:value="bankDataFieldsetOne.bankDataBankAccountTypeOne"
                id="select-bank_data_bank_account_type_one" placeholder="Tipo de conta"
                :options="bankDataBankAccountTypeOneOptions" :disabled="permission === 'read'"></a-select>
            </a-form-item>
          </div>
          <div>
            <a-form-item :label="'Banco ' + (bankDataFieldsetTwoIndex + 1)"
              :name="`bankDataFieldsetTwo.bankDataBankNameTwo_${bankDataFieldsetTwoIndex}`">
              <a-select ref="select" v-model:value="bankDataFieldsetTwo.bankDataBankNameTwo"
                id="select-bank_data_bank_name_two" placeholder="Banco" :options="bankDataBankNameTwoOptions"
                :disabled="permission === 'read'"></a-select>
            </a-form-item>
            <a-form-item label="Agência" name="bankDataFieldsetTwo.bankDataBankBranchTwo">
              <a-input :disabled="permission === 'read'" v-model:value="bankDataFieldsetTwo.bankDataBankBranchTwo"
                id="input-bank_data_bank_branch_two" />
            </a-form-item>
            <a-form-item label="Conta bancária" name="bankDataFieldsetTwo.bankDataBankAccountTwo">
              <a-input :disabled="permission === 'read'" v-model:value="bankDataFieldsetTwo.bankDataBankAccountTwo"
                id="input-bank_data_bank_account_two" />
            </a-form-item>
            <a-form-item :label="'Tipo de conta ' + (bankDataFieldsetTwoIndex + 1)"
              :name="`bankDataFieldsetTwo.bankDataBankAccountTypeTwo_${bankDataFieldsetTwoIndex}`">
              <a-select ref="select" v-model:value="bankDataFieldsetTwo.bankDataBankAccountTypeTwo"
                id="select-bank_data_bank_account_type_two" placeholder="Tipo de conta"
                :options="bankDataBankAccountTypeTwoOptions" :disabled="permission === 'read'"></a-select>
            </a-form-item>
          </div>
        </a-tab-pane>
        <a-tab-pane key="relateFilesTab" tab="Arquivos relacionados">
          <a-space v-for="(relatedFile, relatedFilesIndex) in personProfileDynamicValidateForm.relatedFiles"
            :key="relatedFilesIndex" style="display: flex; margin-bottom: 8px" align="baseline">
            <a-card class='card'>
              <div>
                <a-form-item label="Descrição do arquivo" name="relatedFile.filesDescription">
                  <QuillEditor :enable="permission !== 'read'" ref="filesDescriptionRef"
                    v-model:content="relatedFile.filesDescription" id="input-files_description" contentType="html"
                    theme="snow" />
                </a-form-item>
                <div>
                  <a-form-item label="Arquivos do projeto" name="relatedFile.relatedFilesFiles">
                    <a-button :disabled="permission === 'read'" @click="$refs.relatedFilesFilesFileInput.click()">
                      Upload
                    </a-button>
                    <input type="file" ref="relatedFilesFilesFileInput" style="display: none"
                      @change="(e) => handleFileChange(e, 'relatedFilesFiles')" /><br /><br />
                    <a-list size="small" bordered v-if="personProfileDynamicValidateForm.relatedFilesFiles?.length > 0"
                      item-layout="horizontal" :data-source="personProfileDynamicValidateForm.relatedFilesFiles">
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <template #actions>
                            <a key="remove-file" @click="removeFile(item, 'relatedFilesFiles')">Remover</a>
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
                <a-form-item :label="'Dia de entrada no trabalho ' + (relatedFilesIndex + 1)"
                  :name="`relatedFile.relatedFilesDateDay_${relatedFilesIndex}`">
                  <a-select ref="select" v-model:value="relatedFile.relatedFilesDateDay"
                    id="select-related_files_date_day" placeholder="Dia de entrada no trabalho" required
                    :options="relatedFilesDateDayOptions" :disabled="permission === 'read'"></a-select>
                </a-form-item>
                <a-form-item :label="'Mês de entrada no trabalho ' + (relatedFilesIndex + 1)"
                  :name="`relatedFile.relatedFilesDateMonth_${relatedFilesIndex}`">
                  <a-select ref="select" v-model:value="relatedFile.relatedFilesDateMonth"
                    id="select-related_files_date_month" placeholder="Mês de entrada no trabalho" required
                    :options="relatedFilesDateMonthOptions" :disabled="permission === 'read'"></a-select>
                </a-form-item>
                <a-form-item label="Ano do arquivo" name="relatedFile.relatedFilesDateYear">
                  <a-input-number :disabled="permission === 'read'" v-model:value="relatedFile.relatedFilesDateYear"
                    id="input-related_files_date_year" />
                </a-form-item>
              </div>
              <a-button v-if="permission == 'edit'" type="primary" danger block id="button-remove_related_files"
                @click="removeRelatedFile(relatedFile, personProfileDynamicValidateForm.relatedFiles)">
                <span class="material-symbols-outlined">
                  delete
                </span>
                Remover Arquivos relacionados
              </a-button>
            </a-card>
          </a-space>
          <a-form-item>
            <a-button v-if="permission == 'edit'" type="dashed" block id="button-add_related_files"
              @click="addRelatedFile(personProfileDynamicValidateForm.relatedFiles)">
              <span class="material-symbols-outlined">
                add_circle
              </span>
              Adicionar Arquivos relacionados
            </a-button>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
      <div v-if="permission == 'edit'">
        <a-button v-if="!$route.query._id" type="primary" id="button-form_save" @click="createPersonProfile">
          Salvar
        </a-button>
        <a-button v-if="$route.query._id" type="primary" id="button-form_update"
          @click="updatePersonProfile($route.query._id as string)">
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
const checkPersonEducationsCondition = () => {
  personEducationsConditionElements[0] = (personProfileDynamicValidateForm.personEducation === "completeHigherEducation");
  personEducationsConditionElements[1] = (personProfileDynamicValidateForm.personEducation === "postGraduate");
  personEducationsConditionElements[2] = (personProfileDynamicValidateForm.personEducation === "mastersDegree");
  personEducationsConditionElements[3] = (personProfileDynamicValidateForm.personEducation === "doctorate");
  personEducationsCondition.value = personEducationsConditionElements[0] || personEducationsConditionElements[1] || personEducationsConditionElements[2] || personEducationsConditionElements[3];
};

import {
  ref,
  watch,
  reactive,
  onMounted,
} from 'vue';

let personEducationsConditionElements = [false, false, false, false,
];
let personEducationsCondition: any = ref(false)
import type {
  FormInstance,
  SelectProps,
} from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { Dayjs } from 'dayjs';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const route = useRoute();
const router = useRouter();
let validatePersonProfileForm: [];

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
  if (!route.query._id) return;
  const response = await axios.get(
    `https://api-mumi-backoffice-artist-kunlatek.ngrok.dev/people-profiles/${route.query._id}`,
    {
      headers: {
        Authorization: sessionStorage.getItem('authToken')!,
        'Content-Type': 'application/json'
      }
    }
  );
  if (response.data.statusCode !== 200) return;
  const data = response.data.data;
  for (const attr in data) {
    if (attr in personProfileDynamicValidateForm) personProfileDynamicValidateForm[attr] = data[attr];
    if (attr === 'professions' && data.professions) {
      personProfileDynamicValidateForm.professions = data.professions.map((element: any) => ({
        ...element,
        jobId: {
          label: `${element.jobId.jobCode} - ${element.jobId.jobDescription}`,
          value: element.jobId?._id
        },
      }));
    }

    if (attr === 'tagId' && data.tagId) {
      personProfileDynamicValidateForm.tagId = personProfileDynamicValidateForm.tagId.map((element: any) => {
        return {
          label: `${element.tagName}`,
          value: element._id
        }
      });
    }
  };
  checkPersonEducationsCondition();
});

const personProfileFormRef = ref<FormInstance>();
const personProfileDynamicValidateForm: any = reactive<
  {
    _id: String | null;
    personName: String | null;
    personNickname: String | null;
    gender: String | null;
    birthday: Number | null;
    personDescription: String | null;
    maritalStatus: String | null;
    motherName: String | null;
    fatherName: String | null;
    tagId: [];
    cpf: String | null;
    cpfFile: [] | null;
    rg: String | null;
    rgIssuingAuthority: String | null;
    rgIssuanceDate: Number | null;
    rgState: String | null;
    rgFile: [] | null;
    passport: String | null;
    passportIssuanceDate: Number | null;
    passportExpirationDate: Number | null;
    passportFile: [] | null;
    phoneNumberOne: String | null;
    phoneNumberTwo: String | null;
    emailOne: String | null;
    emailTwo: String | null;
    linkedin: String | null;
    instagram: String | null;
    facebook: String | null;
    x: String | null;
    addressOneCepBrasilApi: String | null;
    addressOneType: String | null;
    addressOneStreet: String | null;
    addressOneNumber: String | null;
    addressOneComplement: String | null;
    addressOneCity: String | null;
    addressOneState: String | null;
    addressTwoCepBrasilApi: String | null;
    addressTwoType: String | null;
    addressTwoStreet: String | null;
    addressTwoNumber: String | null;
    addressTwoComplement: String | null;
    addressTwoCity: String | null;
    addressTwoState: String | null;
    professions: Professions[];
    jobId: String | null;
    jobStartDateMonth: number | null;
    jobStartDateYear: number | null;
    jobFinishDateYear: number | null;
    jobFinishDateMonth: number | null;
    jobDescription: String | null;
    personEducation: String | null;
    personEducations: PersonEducations[];
    personEducationCourse: String | null;
    personEducationInstitution: String | null;
    personEducationStartDate: Number | null;
    personEducationFinishDate: Number | null;
    personEducationDescription: String | null;
    personEducationCertificateFile: [] | null;
    personCourses: PersonCourses[];
    personCourseName: String | null;
    personCourseInstitution: String | null;
    personCourseStartDate: Number | null;
    personCourseFinishDate: Number | null;
    personCourseDescription: String | null;
    personCourseCertificateFile: [] | null;
    personLanguages: String | null;
    relatedFiles: RelatedFiles[];
    filesDescription: String | null;
    relatedFilesFiles: [] | null;
    relatedFilesDateDay: number | null;
    relatedFilesDateMonth: number | null;
    relatedFilesDateYear: number | null;
  }
>(
  {
    _id: null,
    personName: null,
    personNickname: null,
    gender: null,
    birthday: null,
    personDescription: '<p></p>',
    maritalStatus: null,
    motherName: null,
    fatherName: null,
    tagId: [],
    cpf: null,
    cpfFile: [],
    rg: null,
    rgIssuingAuthority: null,
    rgIssuanceDate: null,
    rgState: null,
    rgFile: [],
    passport: null,
    passportIssuanceDate: null,
    passportExpirationDate: null,
    passportFile: [],
    phoneNumberOne: null,
    phoneNumberTwo: null,
    emailOne: null,
    emailTwo: null,
    linkedin: null,
    instagram: null,
    facebook: null,
    x: null,
    addressOneCepBrasilApi: null,
    addressOneType: null,
    addressOneStreet: null,
    addressOneNumber: null,
    addressOneComplement: null,
    addressOneCity: null,
    addressOneState: null,
    addressTwoCepBrasilApi: null,
    addressTwoType: null,
    addressTwoStreet: null,
    addressTwoNumber: null,
    addressTwoComplement: null,
    addressTwoCity: null,
    addressTwoState: null,
    professions: [],
    jobId: null,
    jobStartDateMonth: null,
    jobStartDateYear: null,
    jobFinishDateYear: null,
    jobFinishDateMonth: null,
    jobDescription: '<p></p>',
    personEducation: null,
    personEducations: [],
    personEducationCourse: null,
    personEducationInstitution: null,
    personEducationStartDate: null,
    personEducationFinishDate: null,
    personEducationDescription: '<p></p>',
    personEducationCertificateFile: [],
    personCourses: [],
    personCourseName: null,
    personCourseInstitution: null,
    personCourseStartDate: null,
    personCourseFinishDate: null,
    personCourseDescription: '<p></p>',
    personCourseCertificateFile: [],
    personLanguages: null,
    relatedFiles: [],
    filesDescription: '<p></p>',
    relatedFilesFiles: [],
    relatedFilesDateDay: null,
    relatedFilesDateMonth: null,
    relatedFilesDateYear: null,
  }
);

const resetPersonProfileForm = () => {
  Object.assign(personProfileDynamicValidateForm, {
    _id: null,
    personName: null,
    personNickname: null,
    gender: null,
    birthday: null,
    personDescription: '<p></p>',
    maritalStatus: null,
    motherName: null,
    fatherName: null,
    tagId: [],
    cpf: null,
    cpfFile: [],
    rg: null,
    rgIssuingAuthority: null,
    rgIssuanceDate: null,
    rgState: null,
    rgFile: [],
    passport: null,
    passportIssuanceDate: null,
    passportExpirationDate: null,
    passportFile: [],
    phoneNumberOne: null,
    phoneNumberTwo: null,
    emailOne: null,
    emailTwo: null,
    linkedin: null,
    instagram: null,
    facebook: null,
    x: null,
    addressOneCepBrasilApi: null,
    addressOneType: null,
    addressOneStreet: null,
    addressOneNumber: null,
    addressOneComplement: null,
    addressOneCity: null,
    addressOneState: null,
    addressTwoCepBrasilApi: null,
    addressTwoType: null,
    addressTwoStreet: null,
    addressTwoNumber: null,
    addressTwoComplement: null,
    addressTwoCity: null,
    addressTwoState: null,
    professions: [],
    jobId: null,
    jobStartDateMonth: null,
    jobStartDateYear: null,
    jobFinishDateYear: null,
    jobFinishDateMonth: null,
    jobDescription: '<p></p>',
    personEducation: null,
    personEducations: [],
    personEducationCourse: null,
    personEducationInstitution: null,
    personEducationStartDate: null,
    personEducationFinishDate: null,
    personEducationDescription: '<p></p>',
    personEducationCertificateFile: [],
    personCourses: [],
    personCourseName: null,
    personCourseInstitution: null,
    personCourseStartDate: null,
    personCourseFinishDate: null,
    personCourseDescription: '<p></p>',
    personCourseCertificateFile: [],
    personLanguages: null,
    relatedFiles: [],
    filesDescription: '<p></p>',
    relatedFilesFiles: [],
    relatedFilesDateDay: null,
    relatedFilesDateMonth: null,
    relatedFilesDateYear: null,
  });

  checkPersonEducationsCondition();
};

const handleFileChange = async (event: Event, attribute: string) => {
  message.loading({ content: 'Carregando...', key: 'upload', duration: 0 });
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`https://api-mumi-backoffice-artist-kunlatek.ngrok.dev/people-profiles/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: sessionStorage.getItem('authToken')!,
        },
      });
      personProfileDynamicValidateForm[attribute] = [...personProfileDynamicValidateForm[attribute], response.data.data];
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
  personProfileDynamicValidateForm[attribute] = (personProfileDynamicValidateForm[attribute] as any[]).filter(imageData => imageData.fileId !== item.fileId);
};

const activeKey: any = ref('mainTab');
const genderOptions = ref<SelectProps['options']>(
  [{ "label": "Masculino", "value": "M" }, { "label": "Feminino", "value": "F" }, { "label": "Neutro", "value": "N" }, { "label": "Outro", "value": "O" }]
);
const birthday = ref<Dayjs>();
const personDescriptionRef: any = ref();
const maritalStatusOptions = ref<SelectProps['options']>(
  [{ "label": "Solteiro", "value": "single" }, { "label": "Casado", "value": "married" }, { "label": "Divorciado", "value": "divorced" }, { "label": "Viúvo", "value": "widowed" }, { "label": "Noivo", "value": "engaged" }, { "label": "União estável", "value": "commonLawMarried" }]
);
const tagIdOptions: any = reactive({
  data: [],
  value: [],
  fetching: false,
});

const onTagIdChange = () => { };

const onTagIdSearch = async (searchText: string) => {
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

const rgIssuanceDate = ref<Dayjs>();
const rgStateOptions = ref<SelectProps['options']>(
  [{ "label": "Acre", "value": "ac" }, { "label": "Alagoas", "value": "al" }, { "label": "Amapá", "value": "ap" }, { "label": "Amazonas", "value": "am" }, { "label": "Bahia", "value": "ba" }, { "label": "Ceará", "value": "ce" }, { "label": "Distrito Federal", "value": "df" }, { "label": "Espírito Santo", "value": "es" }, { "label": "Goiás", "value": "go" }, { "label": "Maranhão", "value": "ma" }, { "label": "Mato Grosso", "value": "mt" }, { "label": "Mato Grosso do Sul", "value": "ms" }, { "label": "Minas Gerais", "value": "mg" }, { "label": "Pará", "value": "pa" }, { "label": "Paraíba", "value": "pb" }, { "label": "Paraná", "value": "pr" }, { "label": "Pernambuco", "value": "pe" }, { "label": "Piauí", "value": "pi" }, { "label": "Rio de Janeiro", "value": "rj" }, { "label": "Rio Grande do Norte", "value": "rn" }, { "label": "Rio Grande do Sul", "value": "rs" }, { "label": "Rondônia", "value": "ro" }, { "label": "Roraima", "value": "rr" }, { "label": "Santa Catarina", "value": "sc" }, { "label": "São Paulo", "value": "sp" }, { "label": "Sergipe", "value": "se" }, { "label": "Tocantins", "value": "to" }]
);
const passportIssuanceDate = ref<Dayjs>();
const passportExpirationDate = ref<Dayjs>();
const onAddressOneCepBrasilApiApiRequest = async (addressOneCepBrasilApi: string) => {
  if (!addressOneCepBrasilApi) return;
  const response = await axios.get(
    `https://brasilapi.com.br/api/cep/v1/${addressOneCepBrasilApi}`

  );

  personProfileDynamicValidateForm.addressStreet = response.data.street;
  personProfileDynamicValidateForm.addressDistrict = response.data.neighborhood;
  personProfileDynamicValidateForm.addressCity = response.data.city;
  personProfileDynamicValidateForm.addressState = response.data.state;

};

const onAddressOneCepBrasilApiApiRequestDebounced = debounce(onAddressOneCepBrasilApiApiRequest, 500);

watch(
  () => personProfileDynamicValidateForm.addressOneCepBrasilApi,
  (newAddressOneCepBrasilApi) => {
    onAddressOneCepBrasilApiApiRequestDebounced(newAddressOneCepBrasilApi)
  }
);
const addressOneTypeOptions = ref<SelectProps['options']>(
  [{ "label": "Residencial", "value": "residential" }, { "label": "Comercial", "value": "commercial" }]
);
const onAddressTwoCepBrasilApiApiRequest = async (addressTwoCepBrasilApi: string) => {
  if (!addressTwoCepBrasilApi) return;
  const response = await axios.get(
    `https://brasilapi.com.br/api/cep/v1/${addressTwoCepBrasilApi}`

  );

  personProfileDynamicValidateForm.addressStreet = response.data.street;
  personProfileDynamicValidateForm.addressDistrict = response.data.neighborhood;
  personProfileDynamicValidateForm.addressCity = response.data.city;
  personProfileDynamicValidateForm.addressState = response.data.state;

};

const onAddressTwoCepBrasilApiApiRequestDebounced = debounce(onAddressTwoCepBrasilApiApiRequest, 500);

watch(
  () => personProfileDynamicValidateForm.addressTwoCepBrasilApi,
  (newAddressTwoCepBrasilApi) => {
    onAddressTwoCepBrasilApiApiRequestDebounced(newAddressTwoCepBrasilApi)
  }
);
const addressTwoTypeOptions = ref<SelectProps['options']>(
  [{ "label": "Residencial", "value": "residential" }, { "label": "Comercial", "value": "commercial" }]
);
interface Professions {

  jobId: String | null;
  jobStartDateMonth: Number | null;
  jobStartDateYear: Number | null;
  jobFinishDateYear: Number | null;
  jobFinishDateMonth: Number | null;
  jobDescription: String | null;
};

const removeProfession = (item: Professions, professions: Professions[]) => {
  const index = professions.indexOf(item);
  if (index !== -1) {
    professions.splice(index, 1);
  }
};
const addProfession = (professions: Professions[]) => {
  professions.push({

    jobId: null,
    jobStartDateMonth: null,
    jobStartDateYear: null,
    jobFinishDateYear: null,
    jobFinishDateMonth: null,
    jobDescription: null,
  });
};
const jobIdOptions: any = reactive({
  data: [],
  value: [],
  fetching: false,
});

const onJobIdChange = () => { };

const onJobIdSearch = async (searchText: string) => {
  const response = await axios.get(`
      ${import.meta.env.VITE_BACKEND_ROOT_PATH}/jobs?filter={"$or":[{"jobCode":{"$regex": "${searchText}", "$options": "i"}}, {"jobDescription":{"$regex": "${searchText}", "$options": "i"}}]}`,
    {
      headers: {
        Authorization: sessionStorage.getItem('authToken')!,
        'Content-Type': 'application/json'
      }
    });

  if (response.data.statusCode !== 200) return;

  const body = response.data.data;

  const data = body.result.map((datum: any, index: number) => ({
    id: `autocomplete-job_id_${index}`,
    label: `${datum.jobCode} - ${datum.jobDescription}`,
    value: datum._id
  }));

  jobIdOptions.data = data;
  jobIdOptions.fetching = jobIdOptions.data.length > 0;
};

const onJobIdSearchDebounced = debounce(onJobIdSearch, 500);

const jobDescriptionRef: any = ref();
const personEducationOptions = ref<SelectProps['options']>(
  [{ "label": "Ensino Fundamental Incompleto", "value": "incompleteElementarySchool" }, { "label": "Ensino Fundamental Completo", "value": "completeElementarySchool" }, { "label": "Ensino Médio Incompleto", "value": "incompleteHighSchool" }, { "label": "Ensino Médio Completo", "value": "completeHighSchool" }, { "label": "Ensino Superior Incompleto", "value": "incompleteHigherEducation" }, { "label": "Ensino Superior Completo", "value": "completeHigherEducation" }, { "label": "Pós-Graduação", "value": "postgraduate" }, { "label": "Mestrado", "value": "mastersDegree" }, { "label": "Doutorado", "value": "doctorate" }]
);
interface PersonEducations {

  personEducationCourse: String | null;
  personEducationInstitution: String | null;
  personEducationStartDate: Date | null;
  personEducationFinishDate: Date | null;
  personEducationDescription: String | null;
  personEducationCertificateFile: File | null;
};

const removePersonEducation = (item: PersonEducations, personEducations: PersonEducations[]) => {
  const index = personEducations.indexOf(item);
  if (index !== -1) {
    personEducations.splice(index, 1);
  }
};
const addPersonEducation = (personEducations: PersonEducations[]) => {
  personEducations.push({

    personEducationCourse: null,
    personEducationInstitution: null,
    personEducationStartDate: new Date() | null,
    personEducationFinishDate: new Date() | null,
    personEducationDescription: null,
    personEducationCertificateFile: null,
  });
};
const personEducationStartDate = ref<Dayjs>();
const personEducationFinishDate = ref<Dayjs>();
const personEducationDescriptionRef: any = ref();
interface PersonCourses {

  personCourseName: String | null;
  personCourseInstitution: String | null;
  personCourseStartDate: Date | null;
  personCourseFinishDate: Date | null;
  personCourseDescription: String | null;
  personCourseCertificateFile: File | null;
};

const removePersonCourse = (item: PersonCourses, personCourses: PersonCourses[]) => {
  const index = personCourses.indexOf(item);
  if (index !== -1) {
    personCourses.splice(index, 1);
  }
};
const addPersonCourse = (personCourses: PersonCourses[]) => {
  personCourses.push({

    personCourseName: null,
    personCourseInstitution: null,
    personCourseStartDate: new Date() | null,
    personCourseFinishDate: new Date() | null,
    personCourseDescription: null,
    personCourseCertificateFile: null,
  });
};
const personCourseStartDate = ref<Dayjs>();
const personCourseFinishDate = ref<Dayjs>();
const personCourseDescriptionRef: any = ref();
const personLanguagesOptions = ref<SelectProps['options']>(
  [{ "label": "Alemão", "value": "de" }, { "label": "Albanês", "value": "sq" }, { "label": "Árabe", "value": "ar" }, { "label": "Armênio", "value": "hy" }, { "label": "Basco", "value": "eu" }, { "label": "Bengali", "value": "bn" }, { "label": "Birmanês", "value": "my" }, { "label": "Bislama", "value": "bi" }, { "label": "Bósnio", "value": "bs" }, { "label": "Búlgaro", "value": "bg" }, { "label": "Cazaque", "value": "kk" }, { "label": "Catalão", "value": "ca" }, { "label": "Chamorro", "value": "ch" }, { "label": "Chinês", "value": "zh" }, { "label": "Coreano", "value": "ko" }, { "label": "Croata", "value": "hr" }, { "label": "Dinamarquês", "value": "da" }, { "label": "Eslovaco", "value": "sk" }, { "label": "Esloveno", "value": "sl" }, { "label": "Espanhol", "value": "es" }, { "label": "Estoniano", "value": "et" }, { "label": "Filipino", "value": "fil" }, { "label": "Finlandês", "value": "fi" }, { "label": "Fijiano", "value": "fj" }, { "label": "Feroês", "value": "fo" }, { "label": "Francês", "value": "fr" }, { "label": "Galês", "value": "cy" }, { "label": "Georgiano", "value": "ka" }, { "label": "Grego", "value": "el" }, { "label": "Groenlandês", "value": "kl" }, { "label": "Hebraico", "value": "he" }, { "label": "Hindi", "value": "hi" }, { "label": "Hiri Motu", "value": "ho" }, { "label": "Húngaro", "value": "hu" }, { "label": "Ilha de Páscoa", "value": "rap" }, { "label": "Inglês", "value": "en" }, { "label": "Indonésio", "value": "id" }, { "label": "Inuktitut", "value": "iu" }, { "label": "Irlandês", "value": "ga" }, { "label": "Islandês", "value": "is" }, { "label": "Italiano", "value": "it" }, { "label": "Japonês", "value": "ja" }, { "label": "Javanês", "value": "jv" }, { "label": "Khmer", "value": "km" }, { "label": "Kiribatiano", "value": "gil" }, { "label": "Kosraean", "value": "kos" }, { "label": "Lao", "value": "lo" }, { "label": "Letão", "value": "lv" }, { "label": "Lituano", "value": "lt" }, { "label": "Luxemburguês", "value": "lb" }, { "label": "Macedônio", "value": "mk" }, { "label": "Malaio", "value": "ms" }, { "label": "Maltês", "value": "mt" }, { "label": "Maori", "value": "mi" }, { "label": "Marathi", "value": "mr" }, { "label": "Marshallês", "value": "mh" }, { "label": "Micronésio", "value": "chk" }, { "label": "Mongol", "value": "mn" }, { "label": "Montenegrino", "value": "cnr" }, { "label": "Nepali", "value": "ne" }, { "label": "Norueguês", "value": "no" }, { "label": "Palauano", "value": "pau" }, { "label": "Pohnpeiano", "value": "pon" }, { "label": "Polonês", "value": "pl" }, { "label": "Português", "value": "pt", "isSelected": true }, { "label": "Punjabi", "value": "pa" }, { "label": "Romeno", "value": "ro" }, { "label": "Russo", "value": "ru" }, { "label": "Sami", "value": "se" }, { "label": "Samoano", "value": "sm" }, { "label": "Sérvio", "value": "sr" }, { "label": "Sinhala", "value": "si" }, { "label": "Sueco", "value": "sv" }, { "label": "Tadjique", "value": "tg" }, { "label": "Tailandês", "value": "th" }, { "label": "Tamil", "value": "ta" }, { "label": "Telugu", "value": "te" }, { "label": "Tetum", "value": "tet" }, { "label": "Tcheco", "value": "cs" }, { "label": "Tok Pisin", "value": "tpi" }, { "label": "Tonganês", "value": "to" }, { "label": "Turco", "value": "tr" }, { "label": "Tuvaluano", "value": "tvl" }, { "label": "Urdu", "value": "ur" }, { "label": "Uzbeque", "value": "uz" }, { "label": "Valão", "value": "wa" }, { "label": "Vietnamita", "value": "vi" }, { "label": "Yapese", "value": "yap" }]
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
  [{ "label": "01", "value": 1 }, { "label": "02", "value": 2 }, { "label": "03", "value": 3 }, { "label": "04", "value": 4 }, { "label": "05", "value": 5 }, { "label": "06", "value": 6 }, { "label": "07", "value": 7 }, { "label": "08", "value": 8 }, { "label": "09", "value": 9 }, { "label": "10", "value": 10 }, { "label": "11", "value": 11 }, { "label": "12", "value": 12 }, { "label": "13", "value": 13 }, { "label": "14", "value": 14 }, { "label": "15", "value": 15 }, { "label": "16", "value": 16 }, { "label": "17", "value": 17 }, { "label": "18", "value": 18 }, { "label": "19", "value": 19 }, { "label": "20", "value": 20 }, { "label": "21", "value": 21 }, { "label": "22", "value": 22 }, { "label": "23", "value": 23 }, { "label": "24", "value": 24 }, { "label": "25", "value": 25 }, { "label": "26", "value": 26 }, { "label": "27", "value": 27 }, { "label": "28", "value": 28 }, { "label": "29", "value": 29 }, { "label": "30", "value": 30 }, { "label": "31", "value": 31 }]
);
const relatedFilesDateMonthOptions = ref<SelectProps['options']>(
  [{ "label": "Janeiro", "value": 1 }, { "label": "Fevereiro", "value": 2 }, { "label": "Março", "value": 3 }, { "label": "Abril", "value": 4 }, { "label": "Maio", "value": 5 }, { "label": "Junho", "value": 6 }, { "label": "Julho", "value": 7 }, { "label": "Agosto", "value": 8 }, { "label": "Setembro", "value": 9 }, { "label": "Outubro", "value": 10 }, { "label": "Novembro", "value": 11 }, { "label": "Dezembro", "value": 12 }]
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
const personNameRequiredValidator = async (_rule: Rule, value: any) => {
  if (!value || value === '') return Promise.reject('Campo obrigatório.');
};
const genderRequiredValidator = async (_rule: Rule, value: any) => {
  if (!value || value === '') return Promise.reject('Campo obrigatório.');
};
const birthdayRequiredValidator = async (_rule: Rule, value: any) => {
  if (!value || value === '') return Promise.reject('Campo obrigatório.');
};
const tagIdRequiredValidator = async (_rule: Rule, value: any) => {
  if (!value || value === '') return Promise.reject('Campo obrigatório.');
};
const addressOneStreetRequiredValidator = async (_rule: Rule, value: any) => {
  if (!value || value === '') return Promise.reject('Campo obrigatório.');
};
const addressTwoStreetRequiredValidator = async (_rule: Rule, value: any) => {
  if (!value || value === '') return Promise.reject('Campo obrigatório.');
};
const jobStartDateMonthMaxLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length > 2) return Promise.reject('Máximo de 2 caracteres.');
};
const jobStartDateMonthMinLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length < 1) return Promise.reject('Mínimo de 1 caractere.');
};
const jobStartDateYearMaxLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length > 4) return Promise.reject('Máximo de 4 caracteres.');
};
const jobStartDateYearMinLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length < 4) return Promise.reject('Mínimo de 4 caracteres.');
};
const jobFinishDateYearMaxLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length > 4) return Promise.reject('Máximo de 4 caracteres.');
};
const jobFinishDateYearMinLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length < 4) return Promise.reject('Mínimo de 4 caracteres.');
};
const jobFinishDateMonthMaxLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length > 4) return Promise.reject('Máximo de 4 caracteres.');
};
const jobFinishDateMonthMinLengthValidator = async (_rule: Rule, value: any) => {
  if (value?.length < 4) return Promise.reject('Mínimo de 4 caracteres.');
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

const personProfileRules: Record<string, Rule[]> = { _id: [{ validator: _idRequiredValidator, trigger: 'blur' },], personName: [{ validator: personNameRequiredValidator, trigger: 'blur' },], personNickname: [], gender: [{ validator: genderRequiredValidator, trigger: 'blur' },], birthday: [{ validator: birthdayRequiredValidator, trigger: 'blur' },], personDescription: [], maritalStatus: [], motherName: [], fatherName: [], tagId: [{ validator: tagIdRequiredValidator, trigger: 'blur' },], cpf: [], cpfFile: [], rg: [], rgIssuingAuthority: [], rgIssuanceDate: [], rgState: [], rgFile: [], passport: [], passportIssuanceDate: [], passportExpirationDate: [], passportFile: [], phoneNumberOne: [], phoneNumberTwo: [], emailOne: [], emailTwo: [], linkedin: [], instagram: [], facebook: [], x: [], addressOneCepBrasilApi: [], addressOneType: [], addressOneStreet: [{ validator: addressOneStreetRequiredValidator, trigger: 'blur' },], addressOneNumber: [], addressOneComplement: [], addressOneCity: [], addressOneState: [], addressTwoCepBrasilApi: [], addressTwoType: [], addressTwoStreet: [{ validator: addressTwoStreetRequiredValidator, trigger: 'blur' },], addressTwoNumber: [], addressTwoComplement: [], addressTwoCity: [], addressTwoState: [], jobId: [], jobStartDateMonth: [{ validator: jobStartDateMonthMaxLengthValidator, trigger: 'blur' }, { validator: jobStartDateMonthMinLengthValidator, trigger: 'blur' },], jobStartDateYear: [{ validator: jobStartDateYearMaxLengthValidator, trigger: 'blur' }, { validator: jobStartDateYearMinLengthValidator, trigger: 'blur' },], jobFinishDateYear: [{ validator: jobFinishDateYearMaxLengthValidator, trigger: 'blur' }, { validator: jobFinishDateYearMinLengthValidator, trigger: 'blur' },], jobFinishDateMonth: [{ validator: jobFinishDateMonthMaxLengthValidator, trigger: 'blur' }, { validator: jobFinishDateMonthMinLengthValidator, trigger: 'blur' },], jobDescription: [], personEducation: [], personEducationCourse: [], personEducationInstitution: [], personEducationStartDate: [], personEducationFinishDate: [], personEducationDescription: [], personEducationCertificateFile: [], personCourseName: [], personCourseInstitution: [], personCourseStartDate: [], personCourseFinishDate: [], personCourseDescription: [], personCourseCertificateFile: [], personLanguages: [], filesDescription: [{ validator: filesDescriptionRequiredValidator, trigger: 'blur' },], relatedFilesFiles: [{ validator: relatedFilesFilesRequiredValidator, trigger: 'blur' },], relatedFilesDateDay: [{ validator: relatedFilesDateDayRequiredValidator, trigger: 'blur' },], relatedFilesDateMonth: [{ validator: relatedFilesDateMonthRequiredValidator, trigger: 'blur' },], relatedFilesDateYear: [{ validator: relatedFilesDateYearRequiredValidator, trigger: 'blur' }, { validator: relatedFilesDateYearMaxLengthValidator, trigger: 'blur' }, { validator: relatedFilesDateYearMinLengthValidator, trigger: 'blur' },], };
const handlePersonProfileValidate = (...args: any) => {
  validatePersonProfileForm = args;
};

const createPersonProfile = async () => {
  try {
    if (validatePersonProfileForm?.filter(item => item === false).length > 0) {
      return message.error({ content: 'Erro no preenchimento do formulário.', key: 'saveMessage' });
    }

    const payload = {
      ...personProfileDynamicValidateForm,
      tagId: personProfileDynamicValidateForm.tagId?.map((element: any) => element.value),
      professions: personProfileDynamicValidateForm.professions.map(
        (profession: any) => {
          return {
            ...profession,

            jobId: typeof profession.jobId === 'object'
              ? profession.jobId.value
              : profession.jobId,

          }
        }),
      personEducations: personProfileDynamicValidateForm.personEducations.map(
        (personEducation: any) => {
          return {
            ...personEducation,

          }
        }),
      personCourses: personProfileDynamicValidateForm.personCourses.map(
        (personCourse: any) => {
          return {
            ...personCourse,

          }
        }),
      relatedFiles: personProfileDynamicValidateForm.relatedFiles.map(
        (relatedFile: any) => {
          return {
            ...relatedFile,

          }
        }),
    };

    message.loading({ content: 'Salvando dados...', key: 'saveMessage' });
    const response = await axios.post(
      `https://api-mumi-backoffice-artist-kunlatek.ngrok.dev/people-profiles`,
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
    resetPersonProfileForm();
  } catch (e: any) {
    message.error({ content: 'Erro ao salvar os dados.', key: 'saveMessage' });
    console.error(e.message);
  }
}

const updatePersonProfile = async (id: string) => {
  try {
    if (validatePersonProfileForm?.filter(item => item === false).length > 0) {
      return message.error({ content: 'Erro no preenchimento do formulário.', key: 'saveMessage' });
    }

    const payload = {
      ...personProfileDynamicValidateForm,
      tagId: personProfileDynamicValidateForm.tagId?.map((element: any) => element.value),
      professions: personProfileDynamicValidateForm.professions.map(
        (profession: any) => {
          return {
            ...profession,

            jobId: typeof profession.jobId === 'object'
              ? profession.jobId.value
              : profession.jobId,

          }
        }),
      personEducations: personProfileDynamicValidateForm.personEducations.map(
        (personEducation: any) => {
          return {
            ...personEducation,

          }
        }),
      personCourses: personProfileDynamicValidateForm.personCourses.map(
        (personCourse: any) => {
          return {
            ...personCourse,

          }
        }),
      relatedFiles: personProfileDynamicValidateForm.relatedFiles.map(
        (relatedFile: any) => {
          return {
            ...relatedFile,

          }
        }),
    };

    message.loading({ content: 'Atualizando dados...', key: 'saveMessage' });
    const response = await axios.put(
      `https://api-mumi-backoffice-artist-kunlatek.ngrok.dev/people-profiles/${id}`,
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
    router.push('/person-profile-list');
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

    personProfileDynamicValidateForm._id = userId.value;
  } catch (error) {
    console.error('Failed to decode token:', error);
  }
};
</script>
