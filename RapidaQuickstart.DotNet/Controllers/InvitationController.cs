using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RapidaQuickstart.DotNet.DTOs;
using RapidaQuickstart.DotNet.Services;
using System.Security.Claims;

namespace RapidaQuickstart.DotNet.Controllers
{
    /// <summary>
    /// Invitation management endpoints
    /// </summary>
    [ApiController]
    [Route("api/invitations")]
    public class InvitationController : ControllerBase
    {
        private readonly IInvitationService _invitationService;

        public InvitationController(IInvitationService invitationService)
        {
            _invitationService = invitationService;
        }

        /// <summary>
        /// Create a new invitation
        /// </summary>
        /// <param name="dto">Invitation data</param>
        /// <returns>Created invitation</returns>
        /// <response code="201">Invitation created successfully</response>
        /// <response code="400">Invalid request data</response>
        /// <response code="401">Unauthorized</response>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateInvitation([FromBody] CreateInvitationDto dto)
        {
            try
            {
                var invitedBy = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(invitedBy))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                var invitation = await _invitationService.CreateInvitationAsync(dto, invitedBy);
                return CreatedAtAction(nameof(GetInvitationById), new { id = invitation.Id }, invitation);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get all invitations with filtering and pagination
        /// </summary>
        /// <param name="filterDto">Filter and pagination parameters</param>
        /// <returns>Paginated list of invitations</returns>
        /// <response code="200">Returns paginated invitations</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllInvitations([FromQuery] InvitationFilterDto filterDto)
        {
            try
            {
                var (data, total) = await _invitationService.FindAllAsync(filterDto);
                return Ok(new
                {
                    data,
                    total,
                    page = filterDto.Page,
                    limit = filterDto.Limit,
                    totalPages = (int)Math.Ceiling((double)total / filterDto.Limit)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get invitation by ID
        /// </summary>
        /// <param name="id">Invitation ID</param>
        /// <returns>Invitation</returns>
        /// <response code="200">Returns invitation</response>
        /// <response code="404">Invitation not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetInvitationById(string id)
        {
            try
            {
                var invitation = await _invitationService.FindInvitationByIdAsync(id);
                if (invitation == null)
                {
                    return NotFound(new { message = "Invitation not found" });
                }
                return Ok(invitation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        /// <summary>
        /// Update invitation
        /// </summary>
        /// <param name="id">Invitation ID</param>
        /// <param name="dto">Updated invitation data</param>
        /// <returns>Updated invitation</returns>
        /// <response code="200">Invitation updated successfully</response>
        /// <response code="404">Invitation not found</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="400">Invalid request data</response>
        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateInvitation(string id, [FromBody] UpdateInvitationDto dto)
        {
            try
            {
                var invitation = await _invitationService.UpdateInvitationAsync(id, dto);
                return Ok(invitation);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Delete invitation
        /// </summary>
        /// <param name="id">Invitation ID</param>
        /// <returns>Success message</returns>
        /// <response code="200">Invitation deleted successfully</response>
        /// <response code="404">Invitation not found</response>
        /// <response code="401">Unauthorized</response>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteInvitation(string id)
        {
            try
            {
                await _invitationService.DeleteInvitationAsync(id);
                return Ok(new { message = "Invitation deleted successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        /// <summary>
        /// Resend invitation email
        /// </summary>
        /// <param name="id">Invitation ID</param>
        /// <param name="dto">Resend invitation data</param>
        /// <returns>Success message</returns>
        /// <response code="200">Invitation email sent successfully</response>
        /// <response code="404">Invitation not found</response>
        /// <response code="401">Unauthorized</response>
        /// <response code="400">Invalid request data</response>
        [HttpPost("{id}/resend")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResendInvitation(string id, [FromBody] ResendInvitationDto dto)
        {
            try
            {
                await _invitationService.ResendInvitationAsync(id, dto);
                return Ok(new { message = "Invitation email sent successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
