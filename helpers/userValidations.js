const Joi = require('joi')

const UserSchema = Joi.object().keys({
	userId: Joi.string().regex(new RegExp(/[a-zA-Z0-9]/))
		.required()
		.alphanum()
		.min(3)
		.max(10)
		.error((errors) => {
			errors.forEach((err) => {
				switch (err.code) {
					case 'any.required':
						err.message = '아이디를 입력해주세요'
						break
					case 'string.min':
						err.message = '아이디는 최소 3글자 이상으로 입력해주세요!'
						break
					case 'string.max':
						err.message = '아이디는 최대 10글자까지 가능합니다!'
						break
					case 'string.alphanum':
						err.message = '아이디는 영어와 숫자로 작성해주세요'
						break
					case "string.pattern.base":
						err.message = " 아이디는 영어와 숫자를 섞어서 작성해주세요"
						break
					default:
						break
				}
			})
			return errors
		}),
	nickName: Joi.string()
		.required()
		.min(3)
		.max(20)
		.error((errors) => {
			errors.forEach((err) => {
				switch (err.code) {
					case 'any.required':
						err.message = '닉네임을 입력해주세요!'
						break
					case 'string.min':
						err.message = '닉네임은 최소 3글자 이상으로 입력해주세요!'
						break
					case 'string.max':
						err.message = '닉네임은 최대 20글자까지 가능합니다!'
						break
					default:
						break
				}
			})
			return errors
		}),
	password: Joi.string()
		.min(8)
		.alphanum()
		.regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/))
		.required()
		.error((errors) => {
			errors.forEach((err) => {
				switch (err.code) {
					case 'any.required':
						err.message = '비밀번호를 입력해주세요!'
						break
					case 'string.min':
						err.message = '비밀번호는 최소 8글자 이상으로 입력해주세요!'
						break
					case 'string.alphanum':
						err.message = '비밀번호는 영어와 숫자로만 작성해주세요'
						break
					case "string.pattern.base":
						err.message = " 비밀번호는 최소 하나의 영어 대문자와 소문자와 숫자로 이루어지게 작성해주세요"
						break
					default:
						break
				}
			})
			return errors
		}),
	confirmPassword: Joi.string()
		.required()
		.valid(Joi.ref('password'))
		.error((errors) => {
			errors.forEach((err) => {
				switch (err.code) {
					case 'any.only':
						return (err.message = '비밀번호가 일치하지 않습니다.')
					case 'any.required':
						err.message = '비밀번호 확인란을 입력해주세요!'
						break
					default:
						break
				}
			})
			return errors
		}),

	confirmPassword: Joi.string()
		.required()
		.valid(Joi.ref('password'))
		.error((errors) => {
			errors.forEach((err) => {
				switch (err.code) {
					case 'any.only':
						return (err.message = '비밀번호가 일치하지 않습니다.')
					case 'any.required':
						err.message = '비밀번호 확인란을 입력해주세요!'
						break
					default:
						break
				}
			})
			return errors
		}),
})

module.exports = UserSchema
