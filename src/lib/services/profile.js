import api from "./api";

export const profileService = {
  /**
   * Criar um perfil de pessoa
   * @param {Object} profileData - Dados do perfil de pessoa
   */
  async createPersonProfile(profileData) {
    try {
      const response = await api.post("/person-profiles", profileData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar perfil de pessoa:", error);
      throw error;
    }
  },

  /**
   * Obter um perfil de pessoa pelo ID
   * @param {string} id - ID do perfil
   */
  async getPersonProfileById(id) {
    try {
      const response = await api.get(`/person-profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter perfil de pessoa:", error);
      throw error;
    }
  },

  /**
   * Obter um perfil de pessoa pelo ID de usuário
   * @param {string} userId - ID do usuário
   */
  async getPersonProfileByUserId(userId) {
    try {
      const response = await api.get(`/person-profiles/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter perfil de pessoa por userId:", error);
      throw error;
    }
  },

  /**
   * Atualizar um perfil de pessoa
   * @param {string} id - ID do perfil
   * @param {Object} profileData - Dados atualizados do perfil
   */
  async updatePersonProfile(id, profileData) {
    try {
      const response = await api.patch(`/person-profiles/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil de pessoa:", error);
      throw error;
    }
  },

  /**
   * Excluir um perfil de pessoa
   * @param {string} id - ID do perfil
   */
  async deletePersonProfile(id) {
    try {
      const response = await api.delete(`/person-profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir perfil de pessoa:", error);
      throw error;
    }
  },

  /**
   * Criar um perfil de empresa
   * @param {Object} profileData - Dados do perfil de empresa
   */
  async createCompanyProfile(profileData) {
    try {
      const response = await api.post("/company-profiles", profileData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar perfil de empresa:", error);
      throw error;
    }
  },

  /**
   * Obter um perfil de empresa pelo ID
   * @param {string} id - ID do perfil
   */
  async getCompanyProfileById(id) {
    try {
      const response = await api.get(`/company-profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter perfil de empresa:", error);
      throw error;
    }
  },

  /**
   * Obter um perfil de empresa pelo ID de usuário
   * @param {string} userId - ID do usuário
   */
  async getCompanyProfileByUserId(userId) {
    try {
      const response = await api.get(`/company-profiles/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter perfil de empresa por userId:", error);
      throw error;
    }
  },

  /**
   * Atualizar um perfil de empresa
   * @param {string} id - ID do perfil
   * @param {Object} profileData - Dados atualizados do perfil
   */
  async updateCompanyProfile(id, profileData) {
    try {
      const response = await api.patch(`/company-profiles/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil de empresa:", error);
      throw error;
    }
  },

  /**
   * Excluir um perfil de empresa
   * @param {string} id - ID do perfil
   */
  async deleteCompanyProfile(id) {
    try {
      const response = await api.delete(`/company-profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir perfil de empresa:", error);
      throw error;
    }
  },

  /**
   * Verificar se o usuário possui perfis de pessoa ou empresa
   * @param {string} userId - ID do usuário
   * @return {Object} - Objeto contendo informações sobre os perfis
   * @property {boolean} hasPerson - Indica se o usuário possui um perfil de pessoa
   * @property {boolean} hasCompany - Indica se o usuário possui um perfil de empresa
   * @property {string|null} personId - ID do perfil de pessoa (se existir)
   * @property {string|null} companyId - ID do perfil de empresa (se existir)
   */
  async checkUserProfiles(userId) {
    let profiles = {
      hasPerson: false,
      hasCompany: false,
      personId: null,
      companyId: null,
    };

    
    try {
      const response = await api.get("/users/has-profile");
      const responseData = response.data;
      profiles = {
        ...profiles,
        hasPerson: responseData.person,
        hasCompany: responseData.company,
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      throw error;
    }
    
    if (profiles.hasPerson) {
      const personProfile = await this.getPersonProfileByUserId(userId);
      profiles.personId = personProfile._id;
    }
    
    if (profiles.hasCompany) {
      const companyProfile = await this.getCompanyProfileByUserId(userId);
      profiles.companyId = companyProfile._id;
    }

    return profiles;
  },
};
