frontend/
┣ assets/
┃ ┣ css/
┃ ┃ ┗ main.css
┃ ┗ images/
┣ compasobles/
┃ ┗ useTheme.ts
┣ components/
┃ ┣ blog/
┃ ┃ ┣ BlogCard.vue
┃ ┃ ┣ BlogFilter.vue
┃ ┃ ┣ BlogList.vue
┃ ┃ ┗ BlogSearch.vue
┃ ┣ profile/
┃ ┃ ┣ ProfileForm.vue
┃ ┃ ┣ ProfileStats.vue
┃ ┃ ┣ ProgressChart.vue
┃ ┃ ┗ WorkoutHistory.vue
┃ ┣ schedule/
┃ ┃ ┣ ScheduleCalendar.vue
┃ ┃ ┣ ScheduleFilter.vue
┃ ┃ ┣ TrainerCard.vue
┃ ┃ ┗ WorkoutCard.vue
┃ ┣ trainers/
┃ ┃ ┣ TrainerBooking.vue
┃ ┃ ┣ TrainerFilter.vue
┃ ┃ ┣ TrainerList.vue
┃ ┃ ┗ TrainerProfile.vue
┃ ┗ ui/
┃ ┣ AppAlert.vue
┃ ┣ AppBadge.vue
┃ ┣ AppButton.vue
┃ ┣ AppCard.vue
┃ ┣ AppFooter.vue
┃ ┣ AppHeader.vue
┃ ┣ AppInput.vue
┃ ┣ AppModal.vue
┃ ┣ AppNavigation.vue
┃ ┣ AppSelect.vue
┃ ┣ AppSidebar.vue
┃ ┣ AppTabs.vue
┃ ┣ AppTextArea.vue
┃ ┣ BeltSystemBadge.vue
┃ ┣ FighterStats.vue
┃ ┣ FightingStance.vue
┃ ┣ MartialArtsFilter.vue
┃ ┣ TrainerCard.vue
┃ ┣ TrainingIntensity.vue
┃ ┗ WorkoutCard.vue
┣ layouts/
┃ ┣ auth.vue
┃ ┗ default.vue
┣ middleware/
┃ ┣ auth.js
┃ ┗ guest.js
┣ pages/
┃ ┣ auth/
┃ ┃ ┣ login.vue
┃ ┃ ┗ register.vue
┃ ┣ blog/
┃ ┃ ┣ {category}/
┃ ┃ ┣ index.vue
┃ ┃ ┗ [slug].vue
┃ ┣ profile/
┃ ┃ ┣ history.vue
┃ ┃ ┣ index.vue
┃ ┃ ┗ settings.vue
┃ ┣ schedule/
┃ ┃ ┣ index.vue
┃ ┃ ┗ [id].vue
┃ ┣ trainers/
┃ ┃ ┣ index.vue
┃ ┃ ┗ [id].vue
┃ ┗ index.vue
┣ plugins/
┃ ┗ api.client.js
┣ public/
┣ stores/
┃ ┣ auth.js
┃ ┣ blog.js
┃ ┣ profile.js
┃ ┣ schedule.js
┃ ┗ trainers.js
┣ types/
┃ ┣ components.ts
┃ ┣ index.ts
┃ ┗ utils.ts
┣ utils/
┃ ┣ api.js
┃ ┣ date.js
┃ ┗ validation.js
┣ .env.example
┣ .gitignore
┣ app.vue
┣ nuxt.config.ts
┣ package-lock.json
┣ package.json
┣ README.md
┗ tailwind.config.js
