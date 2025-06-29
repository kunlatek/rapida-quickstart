import api from "./api";

export const profileService = {
  /**
   * @param {import('../interfaces/profile.interfaces').IPersonProfile} profileData
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
   * @param {string} id
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
   * @param {string} userId
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
   * @param {string} id
   * @param {Partial<import('../interfaces/profile.interfaces').IPersonProfile>} profileData
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
   * @param {string} id
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
   * @param {import('../interfaces/profile.interfaces').ICompanyProfile} profileData
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
   * @param {string} id
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
   * @param {string} userId
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
   * @param {string} id
   * @param {Partial<import('../interfaces/profile.interfaces').ICompanyProfile>} profileData
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
   * @param {string} id
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
   * @param {string} userId
   * @returns {Promise<import('../interfaces/profile.interfaces').IProfileCheckResult>}
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
      };
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