const { z } = require('zod');

const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["user", "admin"]).optional()
}).strict();

const SigninSchema = z.object({
    username: z.string(),
    password: z.string()
}).strict();

const AvatarSchema = z.object({
    avatarId: z.number(),
    avatarName: z.string(),
    base64: z.string()
}).strict();

const MetadataSchema = z.object({
    avatarId: z.number
});

const MapSchema = z.object({
    mapId: z.number(),
    mapName: z.string(),
    base64: z.string()
});

const DeleteAvatarSchema = z.object({
    avatarId: z.number(),
});

const DeleteMapSchema = z.object({
    mapId: z.number(),
});

module.exports = {
    SignupSchema,
    SigninSchema,
    MetadataSchema,
    AvatarSchema,
    MapSchema,
    DeleteAvatarSchema,
    DeleteMapSchema
}