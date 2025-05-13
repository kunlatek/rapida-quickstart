import api from "./api";

export const invitationsService = {
    /**
     * Criar uma nova convite
     * @param {Object} invitationData - Dados do convite
     * @returns {Promise<{email: string, role: string, accepted: boolean, createdAt: string, updatedAt: string}>} - Dados do convite criado
     */
    async createInvitation(invitationData) {
        const response = await api.post("/invitations", invitationData);
        return response.data;
    },

    /**
     * Obter todos os convites
     * @returns {Promise<{email: string, role: string, accepted: boolean, createdAt: string, updatedAt: string}[]>} - Todos os convites
     */
    async getInvitations() {
        const response = await api.get("/invitations");
        return response.data;
    },

    /**
     * Obter um convite pelo ID
     * @param {string} id - ID do convite
     * @returns {Promise<{email: string, role: string, accepted: boolean, createdAt: string, updatedAt: string}>} - Dados do convite
     */
    async getInvitationById(id) {
        const response = await api.get(`/invitations/${id}`);
        return response.data;
    },

    /**
     * Atualizar um convite pelo ID
     * @param {string} id - ID do convite
     * @param {Object} invitationData - Dados do convite
     * @returns {Promise<{email: string, role: string, accepted: boolean, createdAt: string, updatedAt: string}>} - Dados do convite atualizado
     */
    async updateInvitation(id, invitationData) {
        const response = await api.put(`/invitations/${id}`, invitationData);
        return response.data;
    },

    /**
     * Deletar um convite pelo ID
     * @param {string} id - ID do convite
     * @returns {Promise<{email: string, role: string, accepted: boolean, createdAt: string, updatedAt: string}>} - Dados do convite deletado
     */
    async deleteInvitation(id) {
        const response = await api.delete(`/invitations/${id}`);
        return response.data;
    },

    /**
     * Enviar um convite
     * @param {string} id - ID do convite
     * @returns {Promise<{email: string, role: string, accepted: boolean, createdAt: string, updatedAt: string}>} - Dados do convite enviado
     */
    async sendInvitation(id) {
        const response = await api.post(`/invitations/${id}/resend`);
        return response.data;
    }
};